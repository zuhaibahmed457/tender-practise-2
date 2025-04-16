import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { UserRole, UserStatus } from '../entities/user.entity';
import { Transform } from 'class-transformer';
import * as dayjs from 'dayjs';
export class GetAllUserDto extends GetAllDto {
  @IsEnum([UserRole.ORGANIZATION, UserRole.TRANSPORTER, UserRole.ADMIN], {
    message: `the role must be ${UserRole.ADMIN}, ${UserRole.TRANSPORTER} OR ${UserRole.ORGANIZATION}`,
  })
  @IsOptional()
  role: UserRole;

  @IsEnum(UserStatus)
  @IsOptional()
  status: UserStatus;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  start_date?: Date;

  @IsOptional()
  @IsDateString()
  @Transform(({ value }) => dayjs(value).toISOString())
  end_date?: Date;
}
