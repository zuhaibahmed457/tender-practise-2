import { PlatformFeeType, PlatformLabel } from '../entities/platform-fee.entity';
export declare class CreatePlatformFeeDto {
    label: PlatformLabel;
    fee: number;
    type: PlatformFeeType;
}
