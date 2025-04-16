import { Tender } from 'src/modules/tender/entities/tender.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class ReviewRating extends BaseEntity {
    id: string;
    rating: number;
    review: string;
    created_at: Date;
    given_by: User;
    given_to: User;
    tender: Tender;
}
