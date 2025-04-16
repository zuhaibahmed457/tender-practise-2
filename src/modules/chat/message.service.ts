
import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message, MessageStatus } from "./entities/message.entity";
import { Not, Repository, UpdateQueryBuilder } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { User, UserRole } from "../users/entities/user.entity";
import { Chat } from "./entities/chat.entity";
import { ParamIdDto } from "src/shared/dtos/paramId.dto";
import { RealTimeGateway } from "src/shared/gateway/real-time.gateway";
import { ChatService } from "./chat.service";
import { S3Service } from "src/shared/services/s3.service";
import { ChatS3Paths } from "./enums/chat-s3.enum";
import { MediaService } from "../media/media.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { NotificationChannel, NotificationEntityType, NotificationType } from "../notifications/entities/notification.entity";
import { Media } from "../media/entities/media.entity";

@Injectable()
export class MessageService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,

        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,

        private readonly realTimeGateway: RealTimeGateway,
        private readonly chatService: ChatService,
        private readonly mediaService: MediaService,
        private readonly eventEmitter: EventEmitter2
    ) { }

    async createMessage(createMessageData: CreateMessageDto, currentUser: User) {
        const sender_id = currentUser.id;
        const { recipient_id, content, chat_id, ...rest } = createMessageData;
        const chat = await this.chatService.findOne(currentUser, { id: chat_id })
        if (!chat) {
            throw new BadRequestException('Chat not found');
        }

        const sender = await this.usersRepository.findOne({
            where: { id: sender_id },
        });

        const message = this.messageRepository.create({
            ...(content && { content }),
            chat: chat,
            sender,
            read_by: [currentUser],
            status: MessageStatus.UNREAD, // Set initial status as unread
        });

        if (rest.file) {
            message.media = await this.mediaService.createMedia(currentUser, { file: rest.file, folder_path: ChatS3Paths.CHAT_FILE })
        }

        const createdMessage = await message.save();
        chat.last_message_sent = createdMessage;
        chat.last_message_sent_at = new Date();
        chat.updated_at = new Date();
        const { participants, ...restChat } = chat
        await this.chatRepository.save(restChat);

        // Get unread message count for each participant
        const unreadCounts = await Promise.all(
            chat.participants.map(async ({ user }) => {
                if (user.id !== currentUser.id) {
                    const count = await this.messageRepository.count({
                        where: {
                            chat: { id: chat_id },
                            status: MessageStatus.UNREAD,
                            read_by: { id: Not(user.id) }
                        }
                    });
                    return { userId: user.id, unreadCount: count };
                }
                return null;
            })
        );
        const message_receiverIds = chat.participants
            .filter(({ user }) => (user.id !== currentUser.id) && (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(user.role)))
            .map(({ user }) => {
                console.log(user.first_name)
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
            notification_type: NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [NotificationChannel.PUSH],
            entity_type: NotificationEntityType.CHAT,
            entity_id: chat.id,
            metadata: { unreadCounts: unreadCounts.filter(count => count !== null) }
        })

        return {
            ...message,
            chat: {
                ...chat,
                last_message_sent: message,
                unread_count: unreadCounts.find(count => count?.userId === currentUser.id)?.unreadCount || 0
            }
        };
    }

    async getAllMessage(getAllMessagesData: any, currentUser: User): Promise<{ items: Message[]; meta: { nextCursor: number | null } }> {
        const { chat_id, search, last_message_id, limit } = getAllMessagesData;

        // Create a query builder for the Message entity
        const queryBuilder = this.messageRepository
            .createQueryBuilder('message')
            .withDeleted()
            .leftJoinAndSelect('message.sender', 'sender')
            .leftJoinAndMapMany('message.media_id', Media, 'media', 'media.id = message.media_id')
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
            .limit(limit) // Limit the number of messages to fetch

        // If there's a last_message_id, paginate by skipping messages before this ID
        if (last_message_id) {
            queryBuilder.andWhere("message.created_at < :last_message_id", { last_message_id: new Date(last_message_id) });
        }

        // Add search functionality if a search term is provided
        if (search) {
            queryBuilder.andWhere('message.content LIKE :search', {
                search: `%${search}%`,
            });
        }

        queryBuilder
            .addOrderBy('message.created_at', 'DESC')
        // Execute the query and get the results
        const messages = await queryBuilder.getRawMany();

        // Calculate the next cursor by getting the ID of the last message in the result
        const nextCursor = messages.length > 0 ? messages[messages.length - 1].created_at : null;

        return {
            items: messages,
            meta: {
                nextCursor: nextCursor,
            },
        };
    }

    async markAllMessageRead({ id }: ParamIdDto, currentUser: User) {
        const chat = await this.chatRepository.findOne({
            where: {
                id: id,
                participants: {
                    user: {
                        id: currentUser.id
                    }
                }
            },
        })

        const messages = await this.messageRepository
            .createQueryBuilder("message")
            .leftJoinAndSelect("message.read_by", "read_by")
            .where("message.chat_id = :chat_id", { chat_id: chat.id })
            .andWhere(
                'NOT EXISTS (' +
                this.messageRepository
                    .createQueryBuilder()
                    .select('1')
                    .from('message_read_by', 'read_by')
                    .where('read_by.message_id = message.id')
                    .andWhere('read_by.user_id = :currentUserId')
                    .getQuery() +
                ')',
            )
            .setParameter('currentUserId', currentUser.id)
            .getMany();


        const messageIds = messages.map((msg) => msg.id);

        if (messageIds.length > 0) {
            await this.messageRepository
                .createQueryBuilder()
                .relation(Message, "read_by")
                .of(messageIds)
                .add(currentUser);
            await this.messageRepository.createQueryBuilder().update(Message).set({ status: MessageStatus.READ }).whereInIds(messageIds).execute();
        }

    }
}
