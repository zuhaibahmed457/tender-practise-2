import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { TenderStatus } from '../entities/tender.entity';
import { ToBoolean } from 'src/utils/to-boolean';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class GetAllTendersDto extends GetAllDto {
  @IsEnum(TenderStatus)
  @IsOptional()
  tender_status?: TenderStatus;

  @IsUUID('all')
  @IsOptional()
  created_by_id?: string;

  @IsUUID('all')
  @IsOptional()
  industry_id?: string;

  @IsUUID('all')
  @IsOptional()
  size_id?: string;

  @IsUUID('all')
  @IsOptional()
  company_type_id?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  price_min?: number;

  @IsNumber()
  @IsOptional()
  price_max?: number;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  exclude_mine?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  exclude_archived?: boolean;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  exclude_already_bidded?: boolean;

  @IsUUID('all')
  @IsOptional()
  organization_bidder_id?: string;

  @IsBoolean()
  @ToBoolean()
  @IsOptional()
  exclude_expired?: boolean;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  start_date?: Date;

  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  @IsOptional()
  end_date?: Date;
}
