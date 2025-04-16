"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const message_entity_1 = require("./entities/message.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const chat_entity_1 = require("./entities/chat.entity");
const real_time_gateway_1 = require("../../shared/gateway/real-time.gateway");
const chat_service_1 = require("./chat.service");
const chat_s3_enum_1 = require("./enums/chat-s3.enum");
const media_service_1 = require("../media/media.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const media_entity_1 = require("../media/entities/media.entity");
let MessageService = class MessageService {
    constructor(messageRepository, chatRepository, usersRepository, realTimeGateway, chatService, mediaService, eventEmitter) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
        this.usersRepository = usersRepository;
        this.realTimeGateway = realTimeGateway;
        this.chatService = chatService;
        this.mediaService = mediaService;
        this.eventEmitter = eventEmitter;
    }
    async createMessage(createMessageData, currentUser) {
        const sender_id = currentUser.id;
        const { recipient_id, content, chat_id, ...rest } = createMessageData;
        const chat = await this.chatService.findOne(currentUser, { id: chat_id });
        if (!chat) {
            throw new common_1.BadRequestException('Chat not found');
        }
        const sender = await this.usersRepository.findOne({
            where: { id: sender_id },
        });
        const message = this.messageRepository.create({
            ...(content && { content }),
            chat: chat,
            sender,
            read_by: [currentUser],
            status: message_entity_1.MessageStatus.UNREAD,
        });
        if (rest.file) {
            message.media = await this.mediaService.createMedia(currentUser, { file: rest.file, folder_path: chat_s3_enum_1.ChatS3Paths.CHAT_FILE });
        }
        const createdMessage = await message.save();
        chat.last_message_sent = createdMessage;
        chat.last_message_sent_at = new Date();
        chat.updated_at = new Date();
        const { participants, ...restChat } = chat;
        await this.chatRepository.save(restChat);
        const unreadCounts = await Promise.all(chat.participants.map(async ({ user }) => {
            if (user.id !== currentUser.id) {
                const count = await this.messageRepository.count({
                    where: {
                        chat: { id: chat_id },
                        status: message_entity_1.MessageStatus.UNREAD,
                        read_by: { id: (0, typeorm_2.Not)(user.id) }
                    }
                });
                return { userId: user.id, unreadCount: count };
            }
            return null;
        }));
        const message_receiverIds = chat.participants
            .filter(({ user }) => (user.id !== currentUser.id) && (![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(user.role)))
            .map(({ user }) => {
            console.log(user.first_name);
            this.realTimeGateway.handleMessage({
                createdMessage: { ...message, chat: { ...chat, last_message_sent: message, unread_count: unreadCounts.find(count => count?.userId === currentUser.id)?.unreadCount || 0 } },
                receiverId: user.id,
            });
            return user.id;
        });
        await this.eventEmitter.emitAsync("create-send-notification", {
            user_ids: message_receiverIds,
            title: `${sender.first_name} ${sender.last_name} sent you a new message`,
            message: `New message from ${sender.first_name} ${sender.last_name}: ${message.content}`,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.PUSH],
            entity_type: notification_entity_1.NotificationEntityType.CHAT,
            entity_id: chat.id,
            metadata: { unreadCounts: unreadCounts.filter(count => count !== null) }
        });
        return {
            ...message,
            chat: {
                ...chat,
                last_message_sent: message,
                unread_count: unreadCounts.find(count => count?.userId === currentUser.id)?.unreadCount || 0
            }
        };
    }
    async getAllMessage(getAllMessagesData, currentUser) {
        const { chat_id, search, last_message_id, limit } = getAllMessagesData;
        const queryBuilder = this.messageRepository
            .createQueryBuilder('message')
            .withDeleted()
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndMapMany('message.media_id', media_entity_1.Media, 'media', 'media.id = message.media_id')
            .leftJoinAndSelect('message.read_by', 'read_by')
            .select([
            'message.*',
            "json_build_object('id', sender.id, 'profile_image', sender.profile_image, 'first_name', sender.first_name, 'last_name', sender.last_name, 'role', sender.role) as sender",
            "json_build_object('id', media.id, 'type', media.type,'url', media.url) as media",
            `
            COALESCE(
                json_agg(
                    DISTINCT jsonb_build_object(
                        'id', read_by.id,
                            'profile_image', read_by.profile_image,
                            'first_name', read_by.first_name,
                            'last_name', read_by.last_name,
                            'role', read_by.role
                    )
                ),
                '[]'
            ) AS read_by
            `,
        ])
            .where('message.chat_id = :chat_id', { chat_id })
            .groupBy('message.id')
            .addGroupBy('sender.id')
            .addGroupBy('media.id')
            .limit(limit);
        if (last_message_id) {
            queryBuilder.andWhere("message.created_at < :last_message_id", { last_message_id: new Date(last_message_id) });
        }
        if (search) {
            queryBuilder.andWhere('message.content LIKE :search', {
                search: `%${search}%`,
            });
        }
        queryBuilder
            .addOrderBy('message.created_at', 'DESC');
        const messages = await queryBuilder.getRawMany();
        const nextCursor = messages.length > 0 ? messages[messages.length - 1].created_at : null;
        return {
            items: messages,
            meta: {
                nextCursor: nextCursor,
            },
        };
    }
    async markAllMessageRead({ id }, currentUser) {
        const chat = await this.chatRepository.findOne({
            where: {
                id: id,
                participants: {
                    user: {
                        id: currentUser.id
                    }
                }
            },
        });
        const messages = await this.messageRepository
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.read_by", "read_by")
            .where("message.chat_id = :chat_id", { chat_id: chat.id })
            .andWhere('NOT EXISTS (' +
            this.messageRepository
                .createQueryBuilder()
                .select('1')
                .from('message_read_by', 'read_by')
                .where('read_by.message_id = message.id')
                .andWhere('read_by.user_id = :currentUserId')
                .getQuery() +
            ')')
            .setParameter('currentUserId', currentUser.id)
            .getMany();
        const messageIds = messages.map((msg) => msg.id);
        if (messageIds.length > 0) {
            await this.messageRepository
                .createQueryBuilder()
                .relation(message_entity_1.Message, "read_by")
                .of(messageIds)
                .add(currentUser);
            await this.messageRepository.createQueryBuilder().update(message_entity_1.Message).set({ status: message_entity_1.MessageStatus.READ }).whereInIds(messageIds).execute();
        }
    }
};
exports.MessageService = MessageService;
exports.MessageService = MessageService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(1, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        real_time_gateway_1.RealTimeGateway,
        chat_service_1.ChatService,
        media_service_1.MediaService,
        event_emitter_1.EventEmitter2])
], MessageService);
//# sourceMappingURL=message.service.js.map