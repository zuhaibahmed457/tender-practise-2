import { User } from 'src/modules/users/entities/user.entity';
export declare enum OtpPurpose {
    FORGOT_PASSWORD = "FORGOT_PASSWORD"
}
export declare class Otp {
    id: string;
    code: string;
    purpose: OtpPurpose;
    expires_at: Date;
    is_used: boolean;
    created_at: Date;
    updated_at: Date;
    user: User;
    generateOtpCode(): void;
}
