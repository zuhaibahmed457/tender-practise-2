import { EventEmitter2 } from '@nestjs/event-emitter';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllChatsDto } from './dto/get-all-chat.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';
export declare class ChatController {
    private readonly chatService;
    private readonly messageService;
    private readonly events;
    constructor(chatService: ChatService, messageService: MessageService, events: EventEmitter2);
    createBid(createChatDto: CreateChatDto, CurrentUser: User): Promise<IResponse>;
    getAllMessage(any: any, currentUser: User): Promise<IResponse>;
    findByBidId(paramIdDto: ParamIdDto, CurrentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, CurrentUser: User): Promise<IResponse>;
    findAll(getAllChatsDto: GetAllChatsDto, CurrentUser: User): Promise<IResponse>;
    sendMessage(createMessageData: CreateMessageDto, currentUser: User): Promise<{
        message: string;
        details: {
            chat: any;
            id: string;
            content: string;
            sender: User;
            media: import("../media/entities/media.entity").Media;
            created_at: Date;
            status: import("./entities/message.entity").MessageStatus;
            updated_at: Date;
            read_by: User[];
        };
    }>;
    markAllMessageRead(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
