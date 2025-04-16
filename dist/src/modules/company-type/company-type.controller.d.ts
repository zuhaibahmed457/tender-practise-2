import { CompanyTypeService } from './company-type.service';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllCompanyTypesDto } from './dto/get-all-company-types.dto';
export declare class CompanyTypeController {
    private readonly companyTypeService;
    constructor(companyTypeService: CompanyTypeService);
    create(createCompanyTypeDto: CreateCompanyTypeDto): string;
    findAll(getAllCompanyTypesDto: GetAllCompanyTypesDto): Promise<IResponse>;
    findOne(id: string): string;
    update(id: string, updateCompanyTypeDto: UpdateCompanyTypeDto): string;
    remove(id: string): string;
}
