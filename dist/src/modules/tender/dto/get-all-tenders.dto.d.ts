import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { TenderStatus } from '../entities/tender.entity';
export declare class GetAllTendersDto extends GetAllDto {
    tender_status?: TenderStatus;
    created_by_id?: string;
    industry_id?: string;
    size_id?: string;
    company_type_id?: string;
    location?: string;
    price_min?: number;
    price_max?: number;
    exclude_mine?: boolean;
    exclude_archived?: boolean;
    exclude_already_bidded?: boolean;
    organization_bidder_id?: string;
    exclude_expired?: boolean;
    start_date?: Date;
    end_date?: Date;
}
