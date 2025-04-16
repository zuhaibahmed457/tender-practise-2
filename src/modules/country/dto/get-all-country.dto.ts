import { IsString, IsOptional, IsEnum } from 'class-validator';
import { CountryStatuses } from '../entities/country.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllCountryDto extends GetAllDto {

  @IsOptional()
  @IsString({ message: 'Code must be a string' })
  code?: string;

  @IsOptional()
  @IsEnum([...Object.values(CountryStatuses), 'all'], { message: 'Invalid status' })
  status?: CountryStatuses | 'all';
}
