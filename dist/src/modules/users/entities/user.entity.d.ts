import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import { BaseEntity } from 'typeorm';
import { Otp } from 'src/modules/auth/entities/otp.entity';
import { UserNotificationSetting } from 'src/modules/notifications/entities/user-notification-setting.entity';
import { UserNotification } from 'src/modules/notifications/entities/user-notification.entity';
import { Country } from 'src/modules/country/entities/country.entity';
import { CompanyType } from 'src/modules/company-type/entities/company-type.entity';
import { UserIndustries } from './user-industries.entity';
import { Media } from 'src/modules/media/entities/media.entity';
import { ReviewRating } from 'src/modules/review-rating/entities/review-rating.entity';
export declare enum UserRole {
    SUPER_ADMIN = "super_admin",
    ADMIN = "admin",
    ORGANIZATION = "organization",
    TRANSPORTER = "transporter"
}
export declare enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare enum UserPaymentMethodStatus {
    NOT_PROVIDED = "not_provided",
    PROVIDED = "provided"
}
export declare enum ConnectAccountStatus {
    NOT_CONNECTED = "not_connected",
    UNDER_REVIEW = "under_review",
    CONNECTED = "connected"
}
export declare class User extends BaseEntity {
    id: string;
    profile_image: Media;
    banner_image: Media;
    first_name: string;
    last_name: string;
    phone_no: string;
    email: string;
    password: string;
    stripe_customer_id: string;
    stripe_connect_account_id: string;
    connect_account_status: ConnectAccountStatus;
    payment_method_status: UserPaymentMethodStatus;
    role: UserRole;
    status: UserStatus;
    time_zone: string;
    country: Country;
    company_type: CompanyType;
    average_rating: number;
    no_of_ratings: number;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    login_attempts: LoginAttempt[];
    otps: Otp[];
    user_notification_setting: UserNotificationSetting;
    user_notifications: UserNotification[];
    user_industries: UserIndustries[];
    given_ratings: ReviewRating[];
    received_ratings: ReviewRating[];
    hashPassword(): Promise<void>;
    comparePassword(receivedPassword: string): Promise<boolean>;
}
