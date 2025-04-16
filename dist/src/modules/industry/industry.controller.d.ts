import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { GetAllIndustriesDto } from './dto/get-all-industries.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
export declare class IndustryController {
    private readonly industryService;
    constructor(industryService: IndustryService);
    create(createIndustryDto: CreateIndustryDto): string;
    findAll(getAllIndustriesDto: GetAllIndustriesDto): Promise<IResponse>;
    findOne(id: string): string;
    update(id: string, updateIndustryDto: UpdateIndustryDto): string;
    remove(id: string): string;
}
