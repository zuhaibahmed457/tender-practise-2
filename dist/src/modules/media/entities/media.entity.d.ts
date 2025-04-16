import { Message } from 'src/modules/chat/entities/message.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum MediaType {
    IMAGE = "image",
    VIDEO = "video",
    PDF = "pdf"
}
export declare class Media extends BaseEntity {
    id: string;
    type: MediaType;
    url: string;
    tender: Tender;
    created_by: User;
    messages: Message;
    created_at: Date;
}
