import { User } from 'src/modules/users/entities/user.entity';
export declare enum PaymentMethodType {
    CARD = "card",
    BANK_ACCOUNT = "us_bank_account"
}
export declare class PaymentMethod {
    id: string;
    user: User;
    stripe_payment_method_id: string;
    type: PaymentMethodType;
    last4: string;
    brand: string;
    expiry_month: number;
    expiry_year: number;
    bank_name: string;
    is_default: boolean;
    created_at: Date;
}
