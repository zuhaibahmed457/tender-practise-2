import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Brackets, In, Repository } from 'typeorm';
import { Bid, BidStatus } from '../bid/entities/bid.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ChatParticipant } from './entities/chat-participant.entity';
import { Message, MessageStatus } from './entities/message.entity';
import { GetAllChatsDto } from './dto/get-all-chat.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationChannel, NotificationEntityType, NotificationType } from '../notifications/entities/notification.entity';
import { Tender } from '../tender/entities/tender.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
    @InjectRepository(ChatParticipant)
    private chatParticipantRepository: Repository<ChatParticipant>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private readonly eventEmitter: EventEmitter2

  ) { }
  async create(createChatDto: CreateChatDto, currentUser: User) {

    const bid = await this.bidRepository.createQueryBuilder("bid")
      .leftJoinAndSelect("bid.tender", "tender")
      .leftJoinAndSelect("bid.bidder", "bidder")
      .leftJoinAndSelect("tender.created_by", "created_by")
      .where('bid.id =:bid_id', { bid_id: createChatDto.bid_id })
      .getOne()

    if (!bid) throw new BadRequestException(`Bid not found`)

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
    })
    if (chatExists) throw new BadRequestException(`Chat already exists`)

    const all_admins = await this.userRepository.find({
      where: {
        role: In([UserRole.ADMIN, UserRole.SUPER_ADMIN])
      }
    })

    const chat = this.chatRepository.create({
      bid,
      group_name: bid.bidder.first_name + " " + bid.bidder.last_name,
      ...createChatDto,
      participants: [bid.bidder, bid.tender.created_by, ...all_admins],
      creator: currentUser,
      tender: bid.tender,
    });

    await chat.save()

    // Save all participants in the chat
    const savedParticipants = await Promise.all(
      [bid.tender.created_by, bid.bidder.id, ...all_admins].map(async (user: User) => {
        const participant = this.chatParticipantRepository.create({
          chat,
          user,
        });
        await participant.save();
        return participant
      })
    );

    // Assign all saved participants to the chat
    chat.participants = savedParticipants;
    const message = this.messageRepository.create({
      chat,
      sender: currentUser,
      content: createChatDto.message,
      read_by: [currentUser],
    })
    await message.save()

    await this.eventEmitter.emitAsync("create-send-notification", {
      user_ids: [bid.bidder.id, ...all_admins.map((user) => user.id)],
      title: `${currentUser.first_name} ${currentUser.last_name} sent you a new message`,
      message: `New message from ${currentUser.first_name} ${currentUser.last_name}: ${message.content}`,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.PUSH],
      entity_type: NotificationEntityType.CHAT,
      entity_id: chat.id,
    })

    chat.last_message_sent = message;
    chat.last_message_sent_at = new Date();
    chat.updated_at = new Date();
    await chat.save()

    return chat
  }

  async findAll(currentUser: User, getAllDto: GetAllChatsDto) {
    const userId = currentUser.id;

    const queryBuilder = this.chatRepository
      .createQueryBuilder('chat')
      .withDeleted()
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndMapMany('chat.tender', Tender, 'tender', 'tender.id = chat.tender.id')
      .leftJoinAndMapMany('chat.bid', Bid, 'bid', 'bid.id = chat.bid')
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

    // Apply search filter on chats based on multiple fields
    if (getAllDto?.search) {
      const searchTerm = `%${getAllDto.search}%`;

      // Search in message content
      queryBuilder.andWhere('messages.content ILIKE :search', { search: searchTerm });

      // Search in participant names (first_name + last_name)
      queryBuilder.orWhere(
        `EXISTS (
          SELECT 1
          FROM chat_participant subParticipant
          INNER JOIN "user" searchUser ON searchUser.id = subParticipant."user_id"
          WHERE subParticipant."chat_id" = chat.id
          AND (
              (searchUser."first_name" || ' ' || searchUser."last_name") ILIKE :search
          )
        )`,
        { search: searchTerm },
      );

    }
    return await queryBuilder.getRawMany();
  }

  async findByBidId(currentUser: User, { id }: ParamIdDto) {
    const chat = await this.chatRepository.findOne({
      where: {
        bid: {
          id: id
        }
      }
    })
    return chat
  }

  async findOne(currentUser: User, { id }: ParamIdDto) {
    const q = this.chatRepository
      .createQueryBuilder('chat')
      .withDeleted()
      .leftJoinAndSelect('chat.participants', 'participant')
      .leftJoinAndSelect('participant.user', 'participant_user')
      .leftJoin('chat.messages', 'messages')
      .leftJoinAndMapMany('chat.tender', Tender, 'tender', 'tender.id = chat.tender.id')
      .leftJoinAndMapMany('chat.bid', Bid, 'bid', 'bid.id = chat.bid')
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

      .where("chat.id =:chat_id", { chat_id: id })
    if (![UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(currentUser.role)) {
      q.andWhere(
        'EXISTS (SELECT 1 FROM chat_participant WHERE chat_participant.chat_id = chat.id AND chat_participant.user_id = :user_id)',
        { user_id: currentUser.id },
      )
    }
    q.groupBy('chat.id')
      .addGroupBy('last_message_sent.id')
      .addGroupBy('tender.id')
      .addGroupBy('bid.id')
      .addGroupBy('created_by.id')
      .addGroupBy('bidder.id')
      .orderBy('chat.updated_at', 'DESC')

    const chat = await q.getRawOne();

    if (!chat) throw new NotFoundException(`Chat not found`)

    return chat
  }

}
