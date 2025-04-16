import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Bid } from '../bid/entities/bid.entity';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ChatParticipant } from './entities/chat-participant.entity';
import { Message } from './entities/message.entity';
import { GetAllChatsDto } from './dto/get-all-chat.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class ChatService {
    private readonly chatRepository;
    private readonly bidRepository;
    private chatParticipantRepository;
    private messageRepository;
    private userRepository;
    private readonly eventEmitter;
    constructor(chatRepository: Repository<Chat>, bidRepository: Repository<Bid>, chatParticipantRepository: Repository<ChatParticipant>, messageRepository: Repository<Message>, userRepository: Repository<User>, eventEmitter: EventEmitter2);
    create(createChatDto: CreateChatDto, currentUser: User): Promise<Chat>;
    findAll(currentUser: User, getAllDto: GetAllChatsDto): Promise<any[]>;
    findByBidId(currentUser: User, { id }: ParamIdDto): Promise<Chat>;
    findOne(currentUser: User, { id }: ParamIdDto): Promise<any>;
}
