import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { User } from '../users/entities/user.entity';
import { GetAllBidsDto } from './dto/get-all-bid.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetBidDashboardGraphDto } from './dto/get-bid-dashboard-graph.dto';
export declare class BidController {
    private readonly bidService;
    constructor(bidService: BidService);
    create(currentUser: User, createBidDto: CreateBidDto): Promise<IResponse>;
    getDashboardGraph(currentUser: User, getBidDashboardGraphDto: GetBidDashboardGraphDto): Promise<{
        message: string;
        details: {
            month: string;
            created: number;
            in_transaction: number;
            accepted: number;
        }[];
    }>;
    findAll(currentUser: User, getAllBidsDto: GetAllBidsDto): Promise<{
        message: string;
        details: import("./entities/bid.entity").Bid[];
        extra: import("nestjs-typeorm-paginate").IPaginationMeta;
    }>;
    acceptBid(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateBidDto: UpdateBidDto): Promise<IResponse>;
}
