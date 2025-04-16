import { BaseEntity } from 'typeorm';
import { UserNotification } from './user-notification.entity';
import { EmailTemplate } from '../enums/email-template.enum';
export declare enum NotificationEntityType {
    CERTIFICATE = "certificate",
    SUBSCRIPTION = "subscription",
    EMPLOYEE = "employee",
    OTP = "otp",
    TENDER = "tender",
    ACCESS_REQUEST = "access_request",
    BID = "bid",
    CHAT = "chat",
    MESSAGE = "message",
    TRANSACTION = "transaction",
    EARNING = "earning",
    OTHER = "other"
}
export declare enum NotificationType {
    TRANSACTION = "transactional",
    NON_TRANSACTIONAL = "non_transactional"
}
export declare enum NotificationChannel {
    EMAIL = "email",
    IN_APP = "in_app",
    PUSH = "push"
}
export declare class Notification extends BaseEntity {
    id: string;
    title: string;
    message: string;
    notification_type: NotificationType;
    template: EmailTemplate;
    channels: NotificationChannel[];
    entity_type: NotificationEntityType;
    entity_id: string | null;
    created_at: Date;
    user_notifications: UserNotification[];
}
