import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { TransactionStatus } from '../entities/transaction.entity';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';
import { UserRole } from 'src/modules/users/entities/user.entity';

export class GetAllTransactionDto extends GetAllDto {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @IsOptional()
  @IsUUID('all', { message: 'Invalid id' })
  organization_id: string;

  @IsOptional()
  @IsEnum([UserRole.ORGANIZATION, UserRole.TRANSPORTER], {
    message: 'Role must be one of the following: organization, transporter',
  })
  role: UserRole;

  @IsOptional()
  @IsNumber()
  price_min?: number;

  @IsOptional()
  @IsNumber()
  price_max?: number;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  end_date?: Date;
}
