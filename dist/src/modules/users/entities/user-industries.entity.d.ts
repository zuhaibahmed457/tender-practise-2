import { BaseEntity } from 'typeorm';
import { User } from './user.entity';
import { Industry } from 'src/modules/industry/entities/industry.entity';
export declare class UserIndustries extends BaseEntity {
    id: string;
    user: User;
    industry: Industry;
    created_at: Date;
}
