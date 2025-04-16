import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { CompanyTypeStatus } from '../entities/company-type.entity';
import { IsEnum, IsOptional } from 'class-validator';

export class GetAllCompanyTypesDto extends GetAllDto {
  @IsOptional()
  @IsEnum(CompanyTypeStatus)
  status: CompanyTypeStatus;
}
