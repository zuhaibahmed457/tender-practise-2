import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { BidStatus } from '../entities/bid.entity';
export declare class GetAllBidsDto extends GetAllDto {
    tender_id?: string;
    bid_status?: BidStatus;
    bidder_id?: string;
    poster_id?: string;
    start_date?: Date;
    end_date?: Date;
    delivery_date_start?: Date;
    delivery_date_end?: Date;
}
