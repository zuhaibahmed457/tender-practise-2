import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { Tender } from '../tender/entities/tender.entity';
import { Bid } from './entities/bid.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GetAllBidsDto } from './dto/get-all-bid.dto';
import { ConfigService } from '@nestjs/config';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import Stripe from 'stripe';
export declare class BidService {
    private readonly tenderRepository;
    private readonly bidRepository;
    private readonly userRepository;
    private readonly stripe;
    private readonly eventEmitter;
    private readonly configService;
    private readonly transactionManagerService;
    constructor(tenderRepository: Repository<Tender>, bidRepository: Repository<Bid>, userRepository: Repository<User>, stripe: Stripe, eventEmitter: EventEmitter2, configService: ConfigService, transactionManagerService: TransactionManagerService);
    create(currentUser: User, createBidDto: CreateBidDto): Promise<Bid>;
    findAll(currentUser: User, getAllBidsDto: GetAllBidsDto): Promise<Pagination<Bid>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Bid>;
    update({ id }: ParamIdDto, updateBidDto: UpdateBidDto): Promise<Bid>;
    acceptBid({ id }: ParamIdDto, currentUser: User): Promise<Bid>;
    remove(id: number): string;
    getBidCounts(currentUser: User, organization_id?: string): Promise<{
        total: number;
        accepted: number;
        in_transaction: number;
        created: number;
    }>;
    getBidGraphStats(currentUser: User, year: number, organization_id?: string): Promise<{
        month: string;
        created: number;
        in_transaction: number;
        accepted: number;
    }[]>;
    sendBidNotificationToCreator(bid: Bid, tender: Tender, currentUser: User): Promise<void>;
    sendConfirmationEmailToBidder(bid: Bid, tender: Tender, currentUser: User): Promise<void>;
}
