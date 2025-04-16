import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { GetAllCompanyTypesDto } from './dto/get-all-company-types.dto';
import { CompanyType } from './entities/company-type.entity';
import { Repository } from 'typeorm';
export declare class CompanyTypeService {
    private readonly companyTypeRepository;
    constructor(companyTypeRepository: Repository<CompanyType>);
    create(createCompanyTypeDto: CreateCompanyTypeDto): string;
    findAll(getAllCompanyTypesDto: GetAllCompanyTypesDto): Promise<import("nestjs-typeorm-paginate").Pagination<CompanyType, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update(id: number, updateCompanyTypeDto: UpdateCompanyTypeDto): string;
    remove(id: number): string;
}
