import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateChatDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  group_name?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  group_icon?: string;

  @IsOptional()
  @IsNumber()
  creator_id?: string;

  @IsOptional()
  @IsNumber()
  last_message_sent_id?: number;

  @IsUUID()
  bid_id: string;

  @IsOptional()
  @IsUUID()
  tender_id?: string;
}

