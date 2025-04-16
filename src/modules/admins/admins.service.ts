import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TenderService } from '../tender/tender.service';
import { BidService } from '../bid/bid.service';
import { Earning, EarningsStatus } from '../earnings/entities/earning.entity';
import {
  Transaction,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,

    private readonly userService: UsersService,
    private readonly tenderService: TenderService,
    private readonly bidService: BidService,
  ) { }

  async dashboard(currentUser: User) {
    const userCounts = await this.userService.userCounts(currentUser);
    const tendersCounts = await this.tenderService.getTenderStates(currentUser);
    const bidsCounts = await this.bidService.getBidCounts(currentUser);

    const earningFromBidders = await this.earningRepository
      .createQueryBuilder('earning')
      .select(['SUM(earning.platform_amount) as platform_amount'])
      .leftJoin('earning.bid', 'bid')
      .leftJoin('bid.bidder', 'bidder')
      .where('bidder.role = :role', { role: UserRole.ORGANIZATION })
      .getRawOne();

    const earningFromTenderPoster = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select(['SUM(transaction.platform_amount) as platform_amount'])
      .where('transaction.status = :success', {
        success: TransactionStatus.SUCCESS,
      })
      .getRawOne();

    return {
      user_counts: userCounts,
      tender_counts: tendersCounts,
      bid_counts: bidsCounts,
      revenue: {
        from_bidders: parseFloat(earningFromBidders.platform_amount || 0),
        from_tender_poster: parseFloat(
          earningFromTenderPoster.platform_amount || 0,
        ),
        total:
          parseFloat(earningFromBidders.platform_amount || 0) +
          parseFloat(earningFromTenderPoster.platform_amount || 0),
      },
    };
  }

  async getRevenue(currentUser: User, year: number) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'June',
      'July',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const fromTenderPosterQuery = this.transactionRepository.createQueryBuilder('transactions')
      .select('EXTRACT(MONTH FROM transactions.created_at)::int', 'month')
      .addSelect('SUM(transactions.platform_amount)', 'fromPoster')
      .where('transactions.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .andWhere('EXTRACT(YEAR FROM transactions.created_at) = :year', { year })
      .groupBy('month')

    const fromBidderQuery = this.earningRepository.createQueryBuilder('earnings')
      .select('EXTRACT(MONTH FROM earnings.created_at)::int', 'month')
      .addSelect('SUM(earnings.platform_amount)', 'fromBidder')
      .where('earnings.status = :status', { status: EarningsStatus.PAID })
      .andWhere('EXTRACT(YEAR FROM earnings.created_at) = :year', { year })
      .groupBy('month')

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role)) {
      fromTenderPosterQuery.andWhere('transactions.user = :userId', { userId: currentUser.id })
      fromBidderQuery.andWhere('earnings.user = :userId', { userId: currentUser.id })
    }

    const fromPoster = await fromTenderPosterQuery.getRawMany();
    const fromBidder = await fromBidderQuery.getRawMany();
    // Transform results into required format with all months
    const monthlyData = months.map((monthName, index) => {
      const monthNumber = index + 1;
      const fromPosterData = fromPoster.find(s => parseInt(s.month) === monthNumber);
      const fromBidderData = fromBidder.find(e => parseInt(e.month) === monthNumber);

      return {
        month: monthName,
        from_poster: parseInt(fromPosterData?.fromPoster || '0'),
        from_bidder: parseInt(fromBidderData?.fromBidder || '0'),
      };
    });

    return monthlyData;
  }
}
