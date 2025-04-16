import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import {
  ConnectAccountStatus,
  User,
  UserRole,
} from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { Tender, TenderStatus } from '../tender/entities/tender.entity';
import { Bid, BidStatus } from './entities/bid.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { BidPolicyFactory } from './factories/update-bid.factory';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { GetAllBidsDto } from './dto/get-all-bid.dto';
import { GetAllBidsFactory } from './factories/get-all-bids.factory';
import { BidStatusCanBeRetrieveBy } from './policies/get-all-bids.policy';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import * as dayjs from 'dayjs';
import { ConfigService } from '@nestjs/config';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import Stripe from 'stripe';
import {
  PlatformFee,
  PlatformFeeType,
  PlatformLabel,
} from '../platform-fees/entities/platform-fee.entity';
import {
  PaymentMethod,
  PaymentMethodType,
} from '../payment-methods/entities/payment-method.entity';
import {
  Transaction,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';

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

@Injectable()
export class BidService {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,

    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,

    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly transactionManagerService: TransactionManagerService,
  ) { }
  async create(currentUser: User, createBidDto: CreateBidDto) {
    if (currentUser.connect_account_status !== ConnectAccountStatus.CONNECTED) {
      throw new BadRequestException(
        'You must connect your stripe connect account to place a bid',
      );
    }

    const tender = await this.tenderRepository.findOne({
      where: { id: createBidDto.tender_id },
      relations: {
        created_by: true,
      },
    });

    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    if (tender.created_by.id === currentUser.id)
      throw new BadRequestException(`You cannot bid on your own tender`);

    if (tender.tender_status !== TenderStatus.APPROVED) {
      throw new BadRequestException(
        'Tender is not approved and hence you cannot be bidded',
      );
    }

    if (tender.is_archived) {
      throw new BadRequestException('Tender is archived');
    }

    if (tender.bid_deadline < new Date()) {
      throw new BadRequestException('Tender deadline has passed');
    }

    // check if the user has already placed a bid for this tender
    const existingBid = await this.bidRepository.findOne({
      where: {
        tender: { id: createBidDto.tender_id },
        bidder: { id: currentUser.id },
      },
    });

    if (existingBid) {
      throw new BadRequestException(
        'You have already placed a bid for this tender',
      );
    }

    // now create the bid
    const bid = this.bidRepository.create({
      ...createBidDto,
      bidder: currentUser,
      tender: tender,
      priority: 0,
    });

    // Notify the tender creator about the new bid
    await this.sendBidNotificationToCreator(bid, tender, currentUser);

    // Send Confirmation email to bidder
    await this.sendConfirmationEmailToBidder(bid, tender, currentUser);

    await bid.save();

    await this.bidRepository.increment(
      {
        priority: MoreThanOrEqual(bid.priority),
        id: Not(bid.id),
        tender: { id: bid.tender.id },
      },
      'priority',
      1,
    );

    return bid;
  }

  async findAll(
    currentUser: User,
    getAllBidsDto: GetAllBidsDto,
  ): Promise<Pagination<Bid>> {
    const {
      page,
      per_page,
      search,
      tender_id,
      bid_status,
      bidder_id,
      poster_id,
      start_date,
      end_date,
      delivery_date_start,
      delivery_date_end,
    } = getAllBidsDto;

    GetAllBidsFactory.canFilter(
      [UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(currentUser.role)
        ? (currentUser.role as unknown as BidStatusCanBeRetrieveBy)
        : poster_id === currentUser.id
          ? BidStatusCanBeRetrieveBy.CREATOR_ORGANIZATION
          : BidStatusCanBeRetrieveBy.BIDDING_ORGANIZATION,
      getAllBidsDto,
      poster_id === currentUser.id,
    );

    const queryBuilder = this.bidRepository
      .createQueryBuilder('bid')
      .leftJoinAndSelect('bid.tender', 'tender')
      .leftJoinAndSelect('tender.created_by', 'created_by')
      .leftJoinAndSelect('bid.bidder', 'bidder');

    if (search) {
      queryBuilder.andWhere('(tender.title ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    if (tender_id) {
      queryBuilder.andWhere('tender.id = :tender_id', { tender_id });
    }

    if (bidder_id) {
      queryBuilder.andWhere('bid.bidder.id = :bidder_id', { bidder_id });
    }

    if (poster_id) {
      queryBuilder.andWhere('tender.created_by.id = :poster_id', { poster_id });
    }

    if (bid_status) {
      queryBuilder.andWhere('bid.status = :bid_status', { bid_status });
    }

    if (start_date) {
      queryBuilder.andWhere('bid.created_at >= :start_date', { start_date });
    }
    if (end_date) {
      queryBuilder.andWhere('bid.created_at <= :end_date', { end_date });
    }

    if (delivery_date_start) {
      queryBuilder.andWhere('bid.delivery_date >= :delivery_date_start', {
        delivery_date_start,
      });
    }

    if (delivery_date_end) {
      queryBuilder.andWhere('bid.delivery_date <= :delivery_date_end', {
        delivery_date_end,
      });
    }

    queryBuilder.orderBy('bid.priority', 'ASC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(queryBuilder, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const bid = await this.bidRepository.findOne({
      where: {
        id,
      },
      relations: {
        bidder: true,
        tender: {
          created_by: true,
        },
      },
    });

    if (!bid) throw new NotFoundException(`Bid not found`);

    return bid;
  }

  async update({ id }: ParamIdDto, updateBidDto: UpdateBidDto) {
    const bid = await this.bidRepository.findOne({
      where: {
        id,
      },
      relations: {
        bidder: true,
        tender: true,
      },
    });
    if (!bid) throw new NotFoundException(`Bid not found`);

    if (bid.tender.bid_deadline < updateBidDto.delivery_date) {
      throw new BadRequestException(
        'Delivery date cannot be before the tender deadline',
      );
    }

    BidPolicyFactory.canUpdate(bid.status, updateBidDto);

    const bidOldPriority = bid.priority;
    const bidNewPriority = updateBidDto.priority;

    Object.assign(bid, updateBidDto);
    bid.priority = updateBidDto.priority ?? bidOldPriority;
    await bid.save();

    if (typeof bidNewPriority === 'number' && bidNewPriority > bidOldPriority) {
      await this.bidRepository.decrement(
        {
          priority: Between(bidOldPriority + 1, bidNewPriority),
          id: Not(bid.id),
          tender: { id: bid.tender.id },
        },
        'priority',
        1,
      );
    } else if (
      typeof bidNewPriority === 'number' &&
      bidNewPriority < bidOldPriority
    ) {
      await this.bidRepository.increment(
        {
          priority: Between(bidNewPriority, bidOldPriority - 1),
          id: Not(bid.id),
          tender: { id: bid.tender.id },
        },
        'priority',
        1,
      );
    }

    return bid;
  }

  async acceptBid({ id }: ParamIdDto, currentUser: User) {
    return await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const bid = await queryRunner.manager.findOne(Bid, {
          where: {
            id,
            tender: {
              created_by: {
                id: currentUser.id,
              },
            },
          },
          relations: {
            bidder: true,
            tender: true,
          },
        });

        if (!bid) throw new NotFoundException(`Bid not found`);

        const bidNotInCreatedStateExists = await queryRunner.manager.findOne(
          Bid,
          {
            where: {
              tender: { id: bid.tender.id },
              status: Not(BidStatus.CREATED),
            },
          },
        );

        if (bidNotInCreatedStateExists) {
          throw new BadRequestException(
            'Their is already a bid in a non created state for this tender',
          );
        }

        const defaultPaymentMethod = await queryRunner.manager.findOne(
          PaymentMethod,
          {
            where: {
              is_default: true,
              user: {
                id: currentUser.id,
              },
            },
          },
        );

        if (!defaultPaymentMethod) {
          throw new BadRequestException('Please add payment method first');
        }

        const platformFee = await queryRunner.manager.findOne(PlatformFee, {
          where: {
            label: PlatformLabel.TENDER_POSTER_FEE,
          },
        });

        let bidAmount = +bid.amount;
        let platformFeeAmount = 0;

        if (platformFee && platformFee.type === PlatformFeeType.PERCENTAGE) {
          platformFeeAmount = (bidAmount * platformFee.fee) / 100;
        } else if (platformFee && platformFee.type === PlatformFeeType.FIXED) {
          platformFeeAmount = +platformFee.fee;
        }

        const totalAmountToBeCharged = Number(
          (bidAmount + platformFeeAmount).toFixed(2),
        );

        const paymentIntent = await this.stripe.paymentIntents.create({
          amount: Number((totalAmountToBeCharged * 100).toFixed(2)),
          currency: 'usd',
          customer: currentUser.stripe_customer_id,
          payment_method_types: [defaultPaymentMethod.type],
          payment_method: defaultPaymentMethod.stripe_payment_method_id,
          // Conditionally add options for ACH
          ...(defaultPaymentMethod.type === PaymentMethodType.BANK_ACCOUNT && {
            payment_method_options: {
              us_bank_account: { verification_method: 'automatic' },
            },
          }),
          metadata: {
            tender_id: bid.tender.id,
            bid_id: bid.id,
          },
          confirm: true,
        });

        const transaction = queryRunner.manager.create(Transaction, {
          total_amount_charged: totalAmountToBeCharged,
          bid_amount: +(bidAmount.toFixed(2)),
          platform_amount: +(platformFeeAmount.toFixed(2)),
          payment_method: defaultPaymentMethod,
          status: TransactionStatus.PENDING,
          stripe_payment_intent_id: paymentIntent.id,
          user: currentUser,
          bid: bid,
        });

        await queryRunner.manager.save(Transaction, transaction);

        bid.status = BidStatus.IN_TRANSACTION;
        bid.tender.tender_status = TenderStatus.IN_TRANSACTION;

        await queryRunner.manager.save(Tender, bid.tender);
        await queryRunner.manager.save(Bid, bid);

        return bid;
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }

  async getBidCounts(currentUser: User, organization_id?: string) {
    if (
      currentUser.role === UserRole.ORGANIZATION &&
      (!organization_id || organization_id !== currentUser.id)
    ) {
      throw new ForbiddenException('You are not authorized to view this data');
    }

    const qb = this.bidRepository
      .createQueryBuilder('bid')
      .select([
        'COUNT(*) AS total',
        `SUM(CASE WHEN bid.status = '${BidStatus.ACCEPTED}' THEN 1 ELSE 0 END) AS accepted`,
        `SUM(CASE WHEN bid.status = '${BidStatus.IN_TRANSACTION}' THEN 1 ELSE 0 END) AS in_transaction`,
        `SUM(CASE WHEN bid.status = '${BidStatus.CREATED}' THEN 1 ELSE 0 END) AS created`,
      ])
      .where('bid.deleted_at IS NULL');

    if (organization_id) {
      qb.andWhere('bid.bidder_id = :organization_id', { organization_id });
    }

    const result = await qb.getRawOne();

    return {
      total: parseInt(result.total || '0', 10),
      accepted: parseInt(result.accepted || '0', 10),
      in_transaction: parseInt(result.in_transaction || '0', 10),
      created: parseInt(result.created || '0', 10),
    };
  }

  async getBidGraphStats(
    currentUser: User,
    year: number,
    organization_id?: string,
  ) {
    if (
      currentUser.role === UserRole.ORGANIZATION &&
      (!organization_id || organization_id !== currentUser.id)
    ) {
      throw new ForbiddenException('You are not authorized to view this data');
    }

    const bidsQuery = await this.bidRepository
      .createQueryBuilder('bids')
      .select('EXTRACT(MONTH FROM bids.created_at)::int', 'month')
      .addSelect(
        `SUM(CASE WHEN bids.status = :created THEN 1 ELSE 0 END)`,
        'created',
      )
      .addSelect(
        `SUM(CASE WHEN bids.status = :inTransaction THEN 1 ELSE 0 END)`,
        'in_transaction',
      )
      .addSelect(
        `SUM(CASE WHEN bids.status = :accepted THEN 1 ELSE 0 END)`,
        'accepted',
      )
      .where('EXTRACT(YEAR FROM bids.created_at) = :year', { year })
      .andWhere('bids.deleted_at IS NULL')

    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role)) {
      bidsQuery.andWhere('bids.bidder_id = :userId', { userId: currentUser.id }) // ya organization filter if needed
    }

    bidsQuery.setParameters({
      created: BidStatus.CREATED,
      inTransaction: BidStatus.IN_TRANSACTION,
      accepted: BidStatus.ACCEPTED,
    })
      .groupBy('month')
    const bids = await bidsQuery.getRawMany();

    const monthlyData = months.map((monthName, index) => {
      const monthNumber = index + 1;
      const bidEntry = bids.find((b) => parseInt(b.month) === monthNumber);

      return {
        month: monthName,
        created: parseInt(bidEntry?.created || '0'),
        in_transaction: parseInt(bidEntry?.in_transaction || '0'),
        accepted: parseInt(bidEntry?.accepted || '0'),
      };
    });

    return monthlyData;
  }

  async sendBidNotificationToCreator(
    bid: Bid,
    tender: Tender,
    currentUser: User,
  ) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [tender.created_by.id],
      title: 'New Bid Received!',
      message: `Your tender "${tender.title}" has received a new bid from ${currentUser.first_name} ${currentUser.last_name}. Check the details now.`,
      template: EmailTemplate.NEW_BID_RECEIVED,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.TENDER,
      entity_id: tender.id,
      meta_data: {
        tender_owner: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
        bidder_name: `${currentUser.first_name} ${currentUser.last_name}`,
        tender_title: tender.title,
        bid_amount: `${bid.amount.toFixed(2)} USD`,
        delivery_date: dayjs(bid.delivery_date).format('MMMM D, YYYY'),
        bid_date: dayjs(bid.created_at).format('MMMM D, YYYY'),
        bid_link: `${this.configService.get('FRONTEND_URL')}/organization/tenders/${tender.id}`,
      },
    });
  }

  async sendConfirmationEmailToBidder(
    bid: Bid,
    tender: Tender,
    currentUser: User,
  ) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [currentUser.id],
      title: 'Your Bid Has Been Submitted!',
      message: `You have successfully placed a bid on the tender "${tender.title}". We will notify you of any updates.`,
      template: EmailTemplate.BID_SUBMISSION_CONFIRMATION,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL],
      bypass_user_preferences: false,
      entity_type: NotificationEntityType.BID,
      entity_id: bid.id,
      meta_data: {
        bidder_name: `${currentUser.first_name} ${currentUser.last_name}`,
        tender_title: tender.title,
        bid_date: dayjs(bid.created_at).format('MMMM D, YYYY'),
      },
    });
  }
}
