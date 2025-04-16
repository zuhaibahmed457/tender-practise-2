import { BidStatus } from '../entities/bid.entity';
import { UpdateBidDto } from '../dto/update-bid.dto';
export declare class BidPolicyFactory {
    private static getAllowedFields;
    static canUpdate(status: BidStatus, updateTenderDto: UpdateBidDto): void;
}
