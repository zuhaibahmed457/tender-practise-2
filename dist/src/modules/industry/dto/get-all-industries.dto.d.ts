import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IndustryStatus } from '../entities/industry.entity';
export declare class GetAllIndustriesDto extends GetAllDto {
    status: IndustryStatus;
    user_id: string;
    exclude_mine: boolean;
    only_include_mine: boolean;
}
