import { Transform } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { UserRole } from 'src/modules/users/entities/user.entity';

export class LogInDto {
  @Transform(({ value }: { value: string }) => value.toLowerCase().trim())
  @IsEmail({}, { message: 'enter Valid email' })
  @IsNotEmpty({ message: 'email should not be empty' })
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(
    [
      UserRole.SUPER_ADMIN,
      UserRole.ADMIN,
      UserRole.ORGANIZATION,
      UserRole.TRANSPORTER,
    ],
    {
      each: true,
      message: `role must be: ${UserRole.SUPER_ADMIN} OR ${UserRole.ADMIN} OR ${UserRole.ORGANIZATION} OR ${UserRole.TRANSPORTER}`,
    },
  )
  @IsNotEmpty()
  roles: UserRole[];
}
