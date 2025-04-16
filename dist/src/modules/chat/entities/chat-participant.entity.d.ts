import { BaseEntity } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare class ChatParticipant extends BaseEntity {
    id: string;
    user: User;
    chat: Chat;
}
