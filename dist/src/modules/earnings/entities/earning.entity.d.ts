import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Tender } from 'src/modules/tender/entities/tender.entity';
import { Transaction } from 'src/modules/transactions/entities/transaction.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare enum EarningsStatus {
    PAID = "PAID",
    REVERSED = "REVERSED"
}
export declare class Earning {
    id: string;
    total_earned: number;
    platform_amount: number;
    bid_amount: number;
    stripe_transfer_payment_intent_id?: string;
    transaction: Transaction;
    bid: Bid;
    tender: Tender;
    user: User;
    status: EarningsStatus;
    created_at: Date;
    updated_at: Date;
}
