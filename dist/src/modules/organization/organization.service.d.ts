import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { User } from '../users/entities/user.entity';
import { EarningsService } from '../earnings/earnings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BidService } from '../bid/bid.service';
import { TenderService } from '../tender/tender.service';
import { GetTendersGraphDto } from '../tender/dto/get-tenders-graph.dto';
export declare class OrganizationService {
    private readonly earningService;
    private readonly transactionService;
    private readonly bidService;
    private readonly tenderService;
    constructor(earningService: EarningsService, transactionService: TransactionsService, bidService: BidService, tenderService: TenderService);
    getDashboardStats({ id: organization_id }: ParamIdDto, currentUser: User): Promise<{
        bids: {
            total: number;
            accepted: number;
            in_transaction: number;
            created: number;
        };
        tenders: any;
        total_spending: number;
        total_earned: number;
    }>;
    getTenderGraphStates(currentUser: User, getTendersGraphDto: GetTendersGraphDto): Promise<{
        month: string;
        spending: number;
        earning: number;
    }[]>;
}
