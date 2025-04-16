import { IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { EarningsStatus } from '../entities/earning.entity';
import { UserRole } from 'src/modules/users/entities/user.entity';
import * as dayjs from 'dayjs';
import { Transform } from 'class-transformer';

export class GetAllEarningDto extends GetAllDto {
  @IsOptional()
  @IsEnum(EarningsStatus)
  status: EarningsStatus;

  @IsOptional()
  @IsUUID('all', { message: 'Invalid id' })
  organization_id: string;

  @IsOptional()
  @IsEnum([UserRole.ORGANIZATION, UserRole.TRANSPORTER], {
    message: 'Role must be one of the following: organization, transporter',
  })
  role: UserRole;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  end_date?: Date;
}
