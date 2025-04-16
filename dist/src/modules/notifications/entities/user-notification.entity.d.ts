import { BaseEntity } from 'typeorm';
import { Notification } from './notification.entity';
import { User } from 'src/modules/users/entities/user.entity';
export declare enum UserNotificationStatus {
    PENDING = "pending",
    SENT = "sent",
    FAILED = "failed"
}
export declare class UserNotification extends BaseEntity {
    id: string;
    notification: Notification;
    is_displayable: boolean;
    bypass_user_preferences: boolean;
    user: User;
    status: UserNotificationStatus;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
