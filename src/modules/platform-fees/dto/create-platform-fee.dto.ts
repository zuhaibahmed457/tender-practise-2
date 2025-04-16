import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import {
  PlatformFeeType,
  PlatformLabel,
} from '../entities/platform-fee.entity';

export class CreatePlatformFeeDto {
  @IsEnum(PlatformLabel)
  @IsNotEmpty()
  label: PlatformLabel;

  @IsNumber()
  @IsNotEmpty()
  fee: number;

  @IsEnum(PlatformFeeType)
  @IsNotEmpty()
  type: PlatformFeeType;
}
