import { Transaction } from '../transactions/entities/transaction.entity';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { Earning } from './entities/earning.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User } from '../users/entities/user.entity';
import { GetAllEarningDto } from './dto/get-all-earning.dto';
export declare class EarningsService {
    private readonly transactionRepository;
    private readonly earningRepository;
    private readonly stripe;
    private readonly transactionManagerService;
    private readonly eventEmitter;
    constructor(transactionRepository: Repository<Transaction>, earningRepository: Repository<Earning>, stripe: Stripe, transactionManagerService: TransactionManagerService, eventEmitter: EventEmitter2);
    createBidTransfer(transaction_id: string): Promise<void>;
    handleEarningsTransferFailed(transaction_id: string): Promise<Earning>;
    findAll(getAllEarningDto: GetAllEarningDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<Earning, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    getTotalEarnings(currentUser: User, organization_id?: string): Promise<{
        total_earned: number;
    }>;
}
