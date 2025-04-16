import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity, Point } from 'typeorm';
export declare class Address extends BaseEntity {
    id: string;
    label: string;
    address: string;
    country: string;
    state: string;
    city: string;
    postal_code: string;
    coordinates: Point;
    created_by: User;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
