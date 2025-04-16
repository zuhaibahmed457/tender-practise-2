import { BidStatusCanBeRetrieveBy } from '../policies/get-all-bids.policy';
import { GetAllBidsDto } from '../dto/get-all-bid.dto';
export declare class GetAllBidsFactory {
    static getAllowedFields(role: BidStatusCanBeRetrieveBy): string[];
    static getAllowedValues(role: BidStatusCanBeRetrieveBy, field: string): string[];
    static canFilterByField(role: BidStatusCanBeRetrieveBy, field: string): boolean;
    static canFilter(role: BidStatusCanBeRetrieveBy, getAllBidderDto: GetAllBidsDto, isOwner?: boolean): void;
}
