import { IsString, Length, Matches, MaxLength, IsEnum } from 'class-validator';
import { CountryStatuses } from '../entities/country.entity';

export class CreateCountryDto {
  @IsString({ message: 'Country code must be a string' })
  @Length(3, 3, { message: 'Country code must be exactly 3 characters' })
  @Matches(/^[A-Z]+$/, { message: 'Country code must contain only uppercase letters' })
  code: string;

  @IsString({ message: 'Country name must be a string' })
  @MaxLength(255, { message: 'Country name cannot exceed 255 characters' })
  name: string;

  @IsString({ message: 'Country code must be a string' })
  @MaxLength(10, { message: 'Country code cannot exceed 10 characters' })
  country_code: string;

  @IsEnum(CountryStatuses, { message: 'Invalid status' })
  status: CountryStatuses;
}
