import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryService } from './country.service';
import { User } from '../users/entities/user.entity';
import { GetAllCountryDto } from './dto/get-all-country.dto';
export declare class CountryController {
    private readonly countryService;
    constructor(countryService: CountryService);
    create(createCountryDto: CreateCountryDto, user: User): Promise<IResponse>;
    findAll(getAllCountryDto: GetAllCountryDto, user?: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateCountryDto: UpdateCountryDto, user: User): Promise<IResponse>;
    remove(paramIdDto: ParamIdDto): Promise<IResponse>;
}
