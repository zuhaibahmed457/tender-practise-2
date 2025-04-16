import {
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsDateString,
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  ArrayNotEmpty,
  IsArray,
  IsPositive,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';
import { ToBoolean } from 'src/utils/to-boolean';
import { BadRequestException } from '@nestjs/common';
import {
  HasExtension,
  HasMimeType,
  IsFile,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateTenderDto {
  @Length(2, 255, { message: 'Title must be between 2 and 255 characters' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsNotEmpty()
  bid_deadline: Date;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Max(1000000000)
  tender_budget_amount: number;

  @IsUUID('all')
  @IsString()
  @IsNotEmpty()
  size_id: string;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @Max(1000000000)
  quantity: number;

  @IsUUID('all', { each: true })
  @ArrayNotEmpty()
  @IsArray()
  @IsNotEmpty()
  industry_ids: string[];

  @IsBoolean()
  @ToBoolean()
  @IsNotEmpty()
  transporter_required: boolean = false;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  @ValidateIf((o: CreateTenderDto) => {
    if (o.transporter_required) {
      return true;
    } else if (!o.transporter_required && o.transportation_budget_amount) {
      throw new BadRequestException(
        'Transportation budget amount is not allowed when transporter is not required.',
      );
    }
  })
  transportation_budget_amount?: number;

  @IsUUID()
  @IsOptional()
  pickup_address_id?: string;

  @IsUUID()
  @IsOptional()
  dropoff_address_id?: string;

  @HasExtension(['jpeg', 'png', 'jpg'])
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'])
  @IsFile({ message: 'Image must be an image' })
  @IsOptional()
  tender_image: MemoryStoredFile;
}
