import { Address } from 'src/modules/address/entities/address.entity';
import { Bid } from 'src/modules/bid/entities/bid.entity';
import { Industry } from 'src/modules/industry/entities/industry.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { ReviewRating } from 'src/modules/review-rating/entities/review-rating.entity';
import { Size } from 'src/modules/sizes/entities/size.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum TenderStatus {
    DRAFT = "draft",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected",
    IN_ACTIVE = "in_active",
    IN_TRANSACTION = "in_transaction",
    IN_PROGRESS = "in_progress",
    DELIVERED = "delivered",
    RECEIVED = "received"
}
export declare class Tender extends BaseEntity {
    id: string;
    title: string;
    bid_deadline: Date;
    tender_budget_amount: number;
    size: Size;
    industries: Industry[];
    tender_status: TenderStatus;
    transporter_required: boolean;
    transportation_budget_amount: number;
    is_archived: boolean;
    quantity: number;
    pickup_address: Address;
    dropoff_address: Address;
    medias: Media[];
    tender_image: Media;
    created_by: User;
    reviews_rating: ReviewRating[];
    bids: Bid[];
    created_at: Date;
    updated_at: Date;
}
