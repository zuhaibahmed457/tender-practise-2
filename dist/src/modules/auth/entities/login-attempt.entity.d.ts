import { User } from 'src/modules/users/entities/user.entity';
import { BaseEntity } from 'typeorm';
export declare enum LoginType {
    FACEBOOK = "facebook",
    APPLE = "apple",
    GOOGlE = "google",
    EMAIL = "email"
}
export declare class LoginAttempt extends BaseEntity {
    id: string;
    access_token: string;
    expire_at: Date;
    logout_at: Date;
    platform: string;
    ip_address: string;
    user_agent: string;
    login_type: LoginType;
    deleted_at: Date;
    created_at: Date;
    updated_at: Date;
    user_socket_id: string;
    fcm_device_token: string;
    user: User;
}
