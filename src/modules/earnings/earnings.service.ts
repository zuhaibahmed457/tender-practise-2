import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/transaction.entity';
import { IsNull, Repository } from 'typeorm';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { Earning, EarningsStatus } from './entities/earning.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import {
  PlatformFee,
  PlatformFeeType,
  PlatformLabel,
} from '../platform-fees/entities/platform-fee.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { User, UserRole, UserStatus } from '../users/entities/user.entity';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { GetAllEarningDto } from './dto/get-all-earning.dto';

@Injectable()
export class EarningsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly transactionManagerService: TransactionManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createBidTransfer(transaction_id: string) {
    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const transaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            id: transaction_id,
          },
          relations: {
            bid: {
              tender: true,
              bidder: true,
            },
          },
        });

        if (!transaction) throw new NotFoundException('Transaction not found');

        const transaction_payment_intent =
          await this.stripe.paymentIntents.retrieve(
            transaction.stripe_payment_intent_id,
          );

        const platformFee = await queryRunner.manager.findOne(PlatformFee, {
          where: {
            label: PlatformLabel.TENDER_BIDDER_FEE,
          },
        });

        let bidAmount = +transaction.bid.amount;
        let platformFeeAmount = 0;

        if (platformFee && platformFee.type === PlatformFeeType.PERCENTAGE) {
          platformFeeAmount = (bidAmount * platformFee.fee) / 100;
        } else if (platformFee && platformFee.type === PlatformFeeType.FIXED) {
          platformFeeAmount = +platformFee.fee;
        }

        const totalAmountToBeTransfer = Number(
          (bidAmount - platformFeeAmount).toFixed(2),
        );

        const transfer = await this.stripe.transfers.create({
          amount: totalAmountToBeTransfer * 100,
          currency: transaction_payment_intent.currency,
          source_transaction:
            transaction_payment_intent.latest_charge.toString(),
          destination: transaction.bid.bidder.stripe_connect_account_id,
          metadata: {
            tender_id: transaction.bid.tender.id,
            transaction: transaction.id,
            bid: transaction.bid.id,
          },
        });

        const earning = queryRunner.manager.create(Earning, {
          bid: transaction.bid,
          transaction: transaction,
          tender: transaction.bid.tender,
          stripe_transfer_payment_intent_id: transfer.id,
          total_earned: +(
            Number(transaction.bid.amount) - Number(transaction.platform_amount)
          ).toFixed(2),
          platform_amount: +Number(transaction.platform_amount).toFixed(2),
          bid_amount: +Number(transaction.bid.amount).toFixed(2),
          status: EarningsStatus.PAID,
          user: transaction.bid.bidder,
        });

        const adminsAndSuperAdmins = await queryRunner.manager.find(User, {
          where: {
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            deleted_at: IsNull(),
          },
        });

        await this.eventEmitter.emitAsync('create-send-notification', {
          user_ids: adminsAndSuperAdmins.map((admin) => admin.id),
          title: 'Bid Amount Transferred - Payment Processed',
          message: `A bid amount has been transferred on the tender "${transaction.bid.tender.title}".`,
          template: EmailTemplate.BID_AMOUNT_TRANSFER_ADMINS,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.EARNING,
          entity_id: earning.id,
          meta_data: {
            tender_title: transaction.bid.tender.title,
            tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
            bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
            platform_fee: `$${Number(transaction.platform_amount).toFixed(2)}`,
            total_amount_transferred: `$${Number(earning.total_earned).toFixed(2)}`,
            stripe_payment_intent_id: transaction.stripe_payment_intent_id,
            admin_dashboard_url: `${process.env.FRONTEND_URL}/admin/dashboard`,
          },
        });

        await this.eventEmitter.emitAsync('create-send-notification', {
          user_ids: [transaction.bid.bidder.id],
          title: 'Bid Amount - Payment Processed',
          message: `Your bid amount transferred has been processed on the tender "${transaction.bid.tender.title}".`,
          template: EmailTemplate.BID_AMOUNT_TRANSFER_BIDDER,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.EARNING,
          entity_id: earning.id,
          meta_data: {
            tender_title: transaction.bid.tender.title,
            tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
            bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
            platform_fee: `$${Number(transaction.platform_amount).toFixed(2)}`,
            total_amount_transferred: `$${Number(earning.total_earned).toFixed(2)}`,
            stripe_payment_intent_id: transaction.stripe_payment_intent_id,
            admin_dashboard_url: `${process.env.FRONTEND_URL}/admin/dashboard`,
            user_name: `${transaction.bid.bidder.first_name} ${transaction.bid.bidder.last_name}`,
          },
        });

        await queryRunner.manager.save(earning);

        return earning;
      },
    );
  }
  async handleEarningsTransferFailed(transaction_id: string) {
    const earning = await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const earning = await queryRunner.manager.findOne(Earning, {
          where: {
            transaction: { id: transaction_id },
          },
        });

        earning.status = EarningsStatus.REVERSED;

        return await queryRunner.manager.save(earning);
      },
    );

    return earning;
  }

  async findAll(getAllEarningDto: GetAllEarningDto, currentUser: User) {
    const {
      status,
      organization_id,
      start_date,
      end_date,
      page,
      per_page,
      search,
      role,
    } = getAllEarningDto;

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      organization_id &&
      organization_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to access Earnings of other users',
      );
    }

    const query = this.earningRepository
      .createQueryBuilder('earning')
      .leftJoinAndSelect('earning.user', 'user')
      .leftJoinAndSelect('earning.bid', 'bid')
      .leftJoinAndSelect('earning.tender', 'tender')
      .leftJoinAndSelect('earning.transaction', 'transaction');

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(currentUser.role)
    ) {
      query.andWhere('user.id = :currentUserId', {
        currentUserId: currentUser.id,
      });
    }

    if (organization_id) {
      query.andWhere('earning.user_id = :userId', { userId: organization_id });
    }

    if (role) {
      query.andWhere('user.role = :role', { role });
    }

    if (status) {
      query.andWhere('earning.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        `(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search OR tender.title ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (start_date) {
      query.andWhere('earning.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('earning.created_at <= :end_date', { end_date });
    }

    query.orderBy('earning.created_at', 'DESC');

    const paginationOption: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<Earning>(query, paginationOption);
  }

  async getTotalEarnings(currentUser: User, organization_id?: string) {
    if (
      currentUser.role === UserRole.ORGANIZATION &&
      (!organization_id || organization_id !== currentUser.id)
    ) {
      throw new ForbiddenException(
        'You do not have permission to view earnings for this organization',
      );
    }

    const query = this.earningRepository
      .createQueryBuilder('earning')
      .select('SUM(earning.total_earned)', 'total_earned');

    if (organization_id) {
      query.where('earning.user_id = :organization_id', {
        organization_id,
      });
    }

    const result = await query.getRawOne();

    return {
      total_earned: parseFloat(result.total_earned || 0),
    };
  }
}
