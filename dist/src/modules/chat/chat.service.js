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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_entity_1 = require("./entities/chat.entity");
const typeorm_2 = require("typeorm");
const bid_entity_1 = require("../bid/entities/bid.entity");
const user_entity_1 = require("../users/entities/user.entity");
const chat_participant_entity_1 = require("./entities/chat-participant.entity");
const message_entity_1 = require("./entities/message.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const tender_entity_1 = require("../tender/entities/tender.entity");
let ChatService = class ChatService {
    constructor(chatRepository, bidRepository, chatParticipantRepository, messageRepository, userRepository, eventEmitter) {
        this.chatRepository = chatRepository;
        this.bidRepository = bidRepository;
        this.chatParticipantRepository = chatParticipantRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.eventEmitter = eventEmitter;
    }
    async create(createChatDto, currentUser) {
        const bid = await this.bidRepository.createQueryBuilder("bid")
            .leftJoinAndSelect("bid.tender", "tender")
            .leftJoinAndSelect("bid.bidder", "bidder")
            .leftJoinAndSelect("tender.created_by", "created_by")
            .where('bid.id =:bid_id', { bid_id: createChatDto.bid_id })
            .getOne();
        if (!bid)
            throw new common_1.BadRequestException(`Bid not found`);
        const chatExists = await this.chatRepository.findOne({
            where: {
                bid: {
                    id: createChatDto.bid_id
                },
                participants: {
                    user: {
                        id: currentUser.id
                    }
                }
            }
        });
        if (chatExists)
            throw new common_1.BadRequestException(`Chat already exists`);
        const all_admins = await this.userRepository.find({
            where: {
                role: (0, typeorm_2.In)([user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN])
            }
        });
        const chat = this.chatRepository.create({
            bid,
            group_name: bid.bidder.first_name + " " + bid.bidder.last_name,
            ...createChatDto,
            participants: [bid.bidder, bid.tender.created_by, ...all_admins],
            creator: currentUser,
            tender: bid.tender,
        });
        await chat.save();
        const savedParticipants = await Promise.all([bid.tender.created_by, bid.bidder.id, ...all_admins].map(async (user) => {
            const participant = this.chatParticipantRepository.create({
                chat,
                user,
            });
            await participant.save();
            return participant;
        }));
        chat.participants = savedParticipants;
        const message = this.messageRepository.create({
            chat,
            sender: currentUser,
            content: createChatDto.message,
            read_by: [currentUser],
        });
        await message.save();
        await this.eventEmitter.emitAsync("create-send-notification", {
            user_ids: [bid.bidder.id, ...all_admins.map((user) => user.id)],
            title: `${currentUser.first_name} ${currentUser.last_name} sent you a new message`,
            message: `New message from ${currentUser.first_name} ${currentUser.last_name}: ${message.content}`,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.PUSH],
            entity_type: notification_entity_1.NotificationEntityType.CHAT,
            entity_id: chat.id,
        });
        chat.last_message_sent = message;
        chat.last_message_sent_at = new Date();
        chat.updated_at = new Date();
        await chat.save();
        return chat;
    }
    async findAll(currentUser, getAllDto) {
        const userId = currentUser.id;
        const queryBuilder = this.chatRepository
            .createQueryBuilder('chat')
            .withDeleted()
            .leftJoinAndSelect('chat.participants', 'participant')
            .leftJoinAndMapMany('chat.tender', tender_entity_1.Tender, 'tender', 'tender.id = chat.tender.id')
            .leftJoinAndMapMany('chat.bid', bid_entity_1.Bid, 'bid', 'bid.id = chat.bid')
            .leftJoinAndSelect('tender.created_by', 'created_by')
            .leftJoinAndSelect('bid.bidder', 'bidder')
            .leftJoinAndSelect('participant.user', 'participant_user')
            .leftJoin('chat.messages', 'messages')
            .leftJoinAndSelect('chat.last_message_sent', 'last_message_sent')
            .leftJoinAndSelect('chat.creator', 'creator')
            .where((qb) => {
            const subQuery = qb.subQuery().select('sub_participant.chat_id').from('chat_participant', 'sub_participant').where('sub_participant.user_id = :user_id').getQuery();
            return 'chat.id IN ' + subQuery;
        })
            .select([
            'chat.*',
            "json_build_object('id', tender.id,'title', tender.title, 'created_by', json_build_object('id', created_by.id, 'first_name', created_by.first_name, 'last_name', created_by.last_name)) AS tender",
            "json_build_object('id', bid.id, 'bidder', json_build_object('id', bidder.id, 'first_name', bidder.first_name, 'last_name', bidder.last_name)) AS bid",
            `json_build_object(
            'id', last_message_sent.id,
            'content', last_message_sent.content,
            'media', CASE 
            WHEN last_message_sent.media_id IS NOT NULL THEN
              (SELECT json_build_object(
                'id', media.id,
                'type', media.type,
                'url', media.url
              )
              FROM media 
              WHERE media.id = last_message_sent.media_id)
            ELSE NULL
          END,
            'created_at', last_message_sent.created_at,
            'updated_at', last_message_sent.updated_at
        ) AS "last_message_sent"`,
            `
        COALESCE(
            json_agg(
                DISTINCT jsonb_build_object(
                    'id', participant.id,
                    'user', json_build_object(
                        'id', participant_user.id,
                        'profile_image', participant_user.profile_image,
                        'first_name', participant_user.first_name,
                        'last_name', participant_user.last_name
                    )
                )
            ),
            '[]'
        ) AS participants
        `,
        ])
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(messages.id)', 'unread_count')
                .from('Message', 'messages')
                .where('messages.chat_id = chat.id')
                .andWhere("messages.status = 'unread'")
                .andWhere('messages.sender.id != :user_id');
        }, 'unread_count')
            .setParameter('user_id', userId)
            .groupBy('chat.id')
            .addGroupBy('tender.id')
            .addGroupBy('bid.id')
            .addGroupBy('created_by.id')
            .addGroupBy('bidder.id')
            .addGroupBy('last_message_sent.id')
            .orderBy('chat.updated_at', 'DESC')
            .addOrderBy('last_message_sent.created_at', 'DESC');
        if (getAllDto?.search) {
            const searchTerm = `%${getAllDto.search}%`;
            queryBuilder.andWhere('messages.content ILIKE :search', { search: searchTerm });
            queryBuilder.orWhere(`EXISTS (
          SELECT 1
          FROM chat_participant subParticipant
          INNER JOIN "user" searchUser ON searchUser.id = subParticipant."user_id"
          WHERE subParticipant."chat_id" = chat.id
          AND (
              (searchUser."first_name" || ' ' || searchUser."last_name") ILIKE :search
          )
        )`, { search: searchTerm });
        }
        return await queryBuilder.getRawMany();
    }
    async findByBidId(currentUser, { id }) {
        const chat = await this.chatRepository.findOne({
            where: {
                bid: {
                    id: id
                }
            }
        });
        return chat;
    }
    async findOne(currentUser, { id }) {
        const q = this.chatRepository
            .createQueryBuilder('chat')
            .withDeleted()
            .leftJoinAndSelect('chat.participants', 'participant')
            .leftJoinAndSelect('participant.user', 'participant_user')
            .leftJoin('chat.messages', 'messages')
            .leftJoinAndMapMany('chat.tender', tender_entity_1.Tender, 'tender', 'tender.id = chat.tender.id')
            .leftJoinAndMapMany('chat.bid', bid_entity_1.Bid, 'bid', 'bid.id = chat.bid')
            .leftJoinAndSelect('tender.created_by', 'created_by')
            .leftJoinAndSelect('bid.bidder', 'bidder')
            .leftJoinAndSelect('chat.last_message_sent', 'last_message_sent')
            .leftJoinAndSelect('chat.creator', 'creator')
            .select([
            'chat.*',
            "json_build_object('id', tender.id,'title', tender.title, 'created_by', json_build_object('id', created_by.id, 'first_name', created_by.first_name,'role', created_by.role, 'last_name', created_by.last_name)) AS tender",
            "json_build_object('id', bid.id, 'bidder', json_build_object('id', bidder.id, 'first_name', bidder.first_name,'role', bidder.role, 'last_name', bidder.last_name)) AS bid",
            `json_build_object(
          'id', last_message_sent.id,
          'content', last_message_sent.content,
          'media', CASE 
            WHEN last_message_sent.media_id IS NOT NULL THEN
              (SELECT json_build_object(
                'id', media.id,
                'type', media.type,
                'url', media.url
              )
              FROM media 
              WHERE media.id = last_message_sent.media_id)
            ELSE NULL
          END,
          'created_at', last_message_sent.created_at,
          'updated_at', last_message_sent.updated_at
        ) AS "last_message_sent"`,
            `
      COALESCE(
          json_agg(
              DISTINCT jsonb_build_object(
                  'id', participant.id,
                  'user', json_build_object(
                      'id', participant_user.id,
                      'profile_image', participant_user.profile_image,
                      'first_name', participant_user.first_name,
                      'last_name', participant_user.last_name,
                      'role', participant_user.role
                  )
              )
          ),
          '[]'
      ) AS participants
      `,
        ])
            .addSelect((subQuery) => {
            return subQuery
                .select('COUNT(messages.id)', 'unread_count')
                .from('Message', 'messages')
                .where('messages.chat_id = chat.id')
                .andWhere("messages.status = 'unread'")
                .andWhere('messages.sender.id != :sender_id');
        }, 'unread_count')
            .setParameter('sender_id', currentUser.id)
            .where("chat.id =:chat_id", { chat_id: id });
        if (![user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN].includes(currentUser.role)) {
            q.andWhere('EXISTS (SELECT 1 FROM chat_participant WHERE chat_participant.chat_id = chat.id AND chat_participant.user_id = :user_id)', { user_id: currentUser.id });
        }
        q.groupBy('chat.id')
            .addGroupBy('last_message_sent.id')
            .addGroupBy('tender.id')
            .addGroupBy('bid.id')
            .addGroupBy('created_by.id')
            .addGroupBy('bidder.id')
            .orderBy('chat.updated_at', 'DESC');
        const chat = await q.getRawOne();
        if (!chat)
            throw new common_1.NotFoundException(`Chat not found`);
        return chat;
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_entity_1.Chat)),
    __param(1, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __param(2, (0, typeorm_1.InjectRepository)(chat_participant_entity_1.ChatParticipant)),
    __param(3, (0, typeorm_1.InjectRepository)(message_entity_1.Message)),
    __param(4, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        event_emitter_1.EventEmitter2])
], ChatService);
//# sourceMappingURL=chat.service.js.map