import { BaseEntity } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Media } from 'src/modules/media/entities/media.entity';
export declare enum MessageStatus {
    SENT = "sent",
    UNREAD = "unread",
    READ = "read"
}
export declare class Message extends BaseEntity {
    id: string;
    content: string;
    sender: User;
    chat: Chat;
    media: Media;
    created_at: Date;
    status: MessageStatus;
    updated_at: Date;
    read_by: User[];
}
