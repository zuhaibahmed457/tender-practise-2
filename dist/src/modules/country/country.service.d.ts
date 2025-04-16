import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllCountryDto } from './dto/get-all-country.dto';
import { User } from '../users/entities/user.entity';
export declare class CountryService {
    private readonly countryRepository;
    constructor(countryRepository: Repository<Country>);
    create(createCountryDto: CreateCountryDto): Promise<Country>;
    findAll(getAllDto: GetAllCountryDto, user: User): Promise<import("nestjs-typeorm-paginate").Pagination<Country, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<Country>;
    update({ id }: ParamIdDto, updateCountryDto: UpdateCountryDto): Promise<Country>;
    remove({ id }: ParamIdDto): Promise<{
        message: string;
    }>;
}
