import { Bid } from 'src/modules/bid/entities/bid.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum TransactionStatus {
    PENDING = "pending",
    SUCCESS = "success",
    FAILED = "failed",
    DISPUTED = "disputed",
    REFUNDED = "refunded"
}
export declare class Transaction extends BaseEntity {
    id: string;
    total_amount_charged: number;
    bid_amount: number;
    platform_amount: number;
    status: TransactionStatus;
    failure_reason?: string;
    stripe_payment_intent_id?: string;
    user: User;
    bid: Bid;
    created_at: Date;
    updated_at: Date;
}
