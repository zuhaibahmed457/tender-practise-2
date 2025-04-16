import { Message, MessageStatus } from "./entities/message.entity";
import { Repository } from "typeorm";
import { CreateMessageDto } from "./dto/create-message.dto";
import { User } from "../users/entities/user.entity";
import { Chat } from "./entities/chat.entity";
import { ParamIdDto } from "src/shared/dtos/paramId.dto";
import { RealTimeGateway } from "src/shared/gateway/real-time.gateway";
import { ChatService } from "./chat.service";
import { MediaService } from "../media/media.service";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Media } from "../media/entities/media.entity";
export declare class MessageService {
    private readonly messageRepository;
    private readonly chatRepository;
    private readonly usersRepository;
    private readonly realTimeGateway;
    private readonly chatService;
    private readonly mediaService;
    private readonly eventEmitter;
    constructor(messageRepository: Repository<Message>, chatRepository: Repository<Chat>, usersRepository: Repository<User>, realTimeGateway: RealTimeGateway, chatService: ChatService, mediaService: MediaService, eventEmitter: EventEmitter2);
    createMessage(createMessageData: CreateMessageDto, currentUser: User): Promise<{
        chat: any;
        id: string;
        content: string;
        sender: User;
        media: Media;
        created_at: Date;
        status: MessageStatus;
        updated_at: Date;
        read_by: User[];
    }>;
    getAllMessage(getAllMessagesData: any, currentUser: User): Promise<{
        items: Message[];
        meta: {
            nextCursor: number | null;
        };
    }>;
    markAllMessageRead({ id }: ParamIdDto, currentUser: User): Promise<void>;
}
