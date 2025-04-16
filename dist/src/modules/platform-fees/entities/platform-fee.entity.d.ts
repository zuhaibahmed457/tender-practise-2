import { BaseEntity } from 'typeorm';
export declare enum PlatformLabel {
    TENDER_POSTER_FEE = "tender_poster_fee",
    TENDER_BIDDER_FEE = "tender_bidder_fee"
}
export declare enum PlatformFeeType {
    FIXED = "fixed",
    PERCENTAGE = "percentage"
}
export declare class PlatformFee extends BaseEntity {
    id: string;
    label: PlatformLabel;
    fee: number;
    type: PlatformFeeType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
