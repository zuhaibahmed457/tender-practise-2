import { UserIndustries } from 'src/modules/users/entities/user-industries.entity';
export declare enum IndustryStatus {
    ACTIVE = "active",
    IN_ACTIVE = "inactive"
}
export declare class Industry {
    id: string;
    name: string;
    status: IndustryStatus;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date;
    user_industries: UserIndustries;
}
