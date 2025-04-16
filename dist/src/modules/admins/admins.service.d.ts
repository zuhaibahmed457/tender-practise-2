import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TenderService } from '../tender/tender.service';
import { BidService } from '../bid/bid.service';
import { Earning } from '../earnings/entities/earning.entity';
import { Transaction } from '../transactions/entities/transaction.entity';
export declare class AdminsService {
    private readonly usersRepository;
    private readonly transactionRepository;
    private readonly earningRepository;
    private readonly userService;
    private readonly tenderService;
    private readonly bidService;
    constructor(usersRepository: Repository<User>, transactionRepository: Repository<Transaction>, earningRepository: Repository<Earning>, userService: UsersService, tenderService: TenderService, bidService: BidService);
    dashboard(currentUser: User): Promise<{
        user_counts: any;
        tender_counts: any;
        bid_counts: {
            total: number;
            accepted: number;
            in_transaction: number;
            created: number;
        };
        revenue: {
            from_bidders: number;
            from_tender_poster: number;
            total: number;
        };
    }>;
    getRevenue(currentUser: User, year: number): Promise<{
        month: string;
        from_poster: number;
        from_bidder: number;
    }[]>;
}
