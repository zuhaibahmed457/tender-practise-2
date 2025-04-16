import { PartialType } from '@nestjs/mapped-types';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  ValidateIf,
} from 'class-validator';
import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto extends PartialType(SignUpDto) {
  @IsEnum([UserRole.ORGANIZATION, UserRole.TRANSPORTER, UserRole.ADMIN], {
    message: `role must be one of these: ${UserRole.ORGANIZATION}  ${UserRole.TRANSPORTER} OR ${UserRole.ADMIN}`,
  })
  @IsOptional()
  role: UserRole;

  @Length(7, 15, { message: 'phoneNumber must be between 7 to 15 digits ' })
  @IsString()
  @ValidateIf(({ phone_no }) => {
    if (phone_no?.length > 0) {
      return true;
    }
  })
  phone_no: string;

  @IsUUID('all', { message: 'invalid id' })
  @IsString()
  @ValidateIf(({ country_id }) => {
    if (country_id?.length > 0) {
      return true;
    }
  })
  country_id: string;

  @IsUUID('all', { message: 'invalid id' })
  @IsString()
  @ValidateIf(({ company_type_id }) => {
    if (company_type_id?.length > 0) {
      return true;
    }
  })
  company_type_id: string;
}
