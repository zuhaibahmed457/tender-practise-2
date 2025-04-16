import { BaseEntity } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { Tender } from '../../tender/entities/tender.entity';
export declare enum BidStatus {
    CREATED = "created",
    IN_TRANSACTION = "in_transaction",
    ACCEPTED = "accepted"
}
export declare class Bid extends BaseEntity {
    id: string;
    delivery_date: Date;
    amount: number;
    priority: number;
    status: BidStatus;
    bidder: User;
    tender: Tender;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
