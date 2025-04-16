import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare class UserNotificationSetting extends BaseEntity {
    id: string;
    is_email_enabled: boolean;
    is_in_app_enabled: boolean;
    is_push_enabled: boolean;
    user: User;
}
