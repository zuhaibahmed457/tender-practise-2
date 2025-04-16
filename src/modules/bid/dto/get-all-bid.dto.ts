import { IsEnum, IsOptional, IsUUID, IsDateString } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { BidStatus } from '../entities/bid.entity';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';

export class GetAllBidsDto extends GetAllDto {
  @IsOptional()
  @IsUUID()
  tender_id?: string;

  @IsOptional()
  @IsEnum(BidStatus)
  bid_status?: BidStatus;

  @IsOptional()
  @IsUUID()
  bidder_id?: string;
  
  @IsOptional()
  @IsUUID()
  poster_id?: string;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  end_date?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  delivery_date_start?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  delivery_date_end?: Date;
}
