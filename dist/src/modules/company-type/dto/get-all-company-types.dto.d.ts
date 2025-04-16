import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { CompanyTypeStatus } from '../entities/company-type.entity';
export declare class GetAllCompanyTypesDto extends GetAllDto {
    status: CompanyTypeStatus;
}
