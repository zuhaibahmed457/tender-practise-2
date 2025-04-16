import { CountryStatuses } from '../entities/country.entity';
export declare class CreateCountryDto {
    code: string;
    name: string;
    country_code: string;
    status: CountryStatuses;
}
