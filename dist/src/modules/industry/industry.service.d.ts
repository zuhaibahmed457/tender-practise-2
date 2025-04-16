import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { Industry } from './entities/industry.entity';
import { Repository } from 'typeorm';
import { GetAllIndustriesDto } from './dto/get-all-industries.dto';
export declare class IndustryService {
    private readonly industryRepository;
    constructor(industryRepository: Repository<Industry>);
    create(createIndustryDto: CreateIndustryDto): string;
    findAll(getAllIndustriesDto: GetAllIndustriesDto): Promise<import("nestjs-typeorm-paginate").Pagination<Industry, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update(id: number, updateIndustryDto: UpdateIndustryDto): string;
    remove(id: number): string;
}
