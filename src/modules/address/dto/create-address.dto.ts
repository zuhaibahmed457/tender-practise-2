import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsLatitude,
  IsLongitude,
  IsPostalCode,
} from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsPostalCode('any') // Validates international postal codes
  @IsOptional()
  postal_code?: string;

  @IsLatitude()
  @IsNotEmpty()
  latitude: number;

  @IsLongitude()
  @IsNotEmpty()
  longitude: number;
}
