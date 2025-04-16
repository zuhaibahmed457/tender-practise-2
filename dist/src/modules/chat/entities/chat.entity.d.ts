import { BaseEntity } from 'typeorm';
import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { ChatParticipant } from './chat-participant.entity';
import { Message } from './message.entity';
export declare class Chat extends BaseEntity {
    id: string;
    group_name?: string;
    group_icon?: string;
    is_archived: Boolean;
    creator: User;
    participants: ChatParticipant[];
    messages: Message[];
    created_at: number;
    last_message_sent: Message;
    last_message_sent_at: Date;
    bid: Bid;
    tender: Tender;
    updated_at: Date;
    archived_at: Date;
}
