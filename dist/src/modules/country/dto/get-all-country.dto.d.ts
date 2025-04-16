import { CountryStatuses } from '../entities/country.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetAllCountryDto extends GetAllDto {
    code?: string;
    status?: CountryStatuses | 'all';
}
