import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { Tender, TenderStatus } from './entities/tender.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { Industry, IndustryStatus } from '../industry/entities/industry.entity';
import { Size, SizeStatus } from '../sizes/entities/size.entity';
import { Address } from '../address/entities/address.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { TenderPolicyFactory } from './factories/update-tender.factory';
import { GetAllTendersDto } from './dto/get-all-tenders.dto';
import { GetAllTendersFactory } from './factories/get-all-tenders.factory';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { S3Service } from 'src/shared/services/s3.service';
import { MediaService } from '../media/media.service';
import { ManageStatusDto } from './dto/manage-status.dto';
import { ManageTenderStatusPolicyFactory } from './factories/manage-tender-status.factory';
import { TenderStatusCanBeUpdatedBy } from './policies/manage-tender-status.policy';
import { TenderS3Paths } from './enums/tender-s3.enum';
import { Bid, BidStatus } from '../bid/entities/bid.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import * as dayjs from 'dayjs';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';
import { ConfigService } from '@nestjs/config';
import { EarningsService } from '../earnings/earnings.service';
import {
  Transaction,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';
import { Earning, EarningsStatus } from '../earnings/entities/earning.entity';
import { GetTendersGraphDto } from './dto/get-tenders-graph.dto';

@Injectable()
export class TenderService {
  constructor(
    @InjectRepository(Tender)
    private readonly tenderRepository: Repository<Tender>,

    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,

    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,

    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,

    @InjectRepository(Earning)
    private readonly earningRepository: Repository<Earning>,

    private readonly s3Service: S3Service,
    private readonly mediaService: MediaService,
    private readonly eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
    private readonly earningService: EarningsService,
  ) { }

  async create(currentUser: User, createTenderDto: CreateTenderDto) {
    const {
      industry_ids,
      size_id,
      pickup_address_id,
      dropoff_address_id,
      tender_image,
      ...rest
    } = createTenderDto;

    const industries = await this.industryRepository.find({
      where: { id: In(industry_ids), status: IndustryStatus.ACTIVE },
    });

    if (industries.length < 1) {
      throw new BadRequestException(
        'Please select at least one valid industry',
      );
    }

    const size = await this.sizeRepository.findOne({
      where: { id: size_id, status: SizeStatus.ACTIVE },
    });

    if (!size) {
      throw new BadRequestException('Size not found');
    }

    const tender = this.tenderRepository.create({
      ...rest,
      created_by: currentUser,
      tender_status: TenderStatus.DRAFT,
      industries,
      size,
    });

    if (createTenderDto.tender_image) {
      tender.tender_image = await this.mediaService.createMedia(currentUser, {
        file: createTenderDto.tender_image,
        folder_path: TenderS3Paths.TENDER_IMAGE,
      });
    }

    if (pickup_address_id) {
      const pickupAddress = await this.addressRepository.findOne({
        where: { id: pickup_address_id, created_by: { id: currentUser.id } },
      });

      if (!pickupAddress) {
        throw new BadRequestException('Pickup address not found');
      }

      tender.pickup_address = pickupAddress;
    }

    if (dropoff_address_id) {
      const dropoffAddress = await this.addressRepository.findOne({
        where: { id: dropoff_address_id, created_by: { id: currentUser.id } },
      });

      if (!dropoffAddress) {
        throw new BadRequestException('Dropoff address not found');
      }

      tender.dropoff_address = dropoffAddress;
    }

    return tender.save();
  }

  async findAll(currentUser: User, getAllTendersDto: GetAllTendersDto) {
    const {
      page,
      per_page,
      search,
      tender_status,
      created_by_id,
      industry_id,
      size_id,
      company_type_id,
      location,
      price_min,
      price_max,
      exclude_mine,
      exclude_archived,
      exclude_already_bidded,
      organization_bidder_id,
      exclude_expired,
      end_date,
      start_date,
    } = getAllTendersDto;

    GetAllTendersFactory.canFilter(
      currentUser.role,
      getAllTendersDto,
      currentUser.id === created_by_id,
    );

    const query = this.tenderRepository
      .createQueryBuilder('tender')
      .leftJoinAndSelect('tender.created_by', 'created_by')
      .leftJoinAndSelect('created_by.company_type', 'company_type')
      .leftJoinAndSelect('tender.size', 'size')
      .leftJoinAndSelect('tender.industries', 'industries')
      .leftJoinAndSelect('tender.pickup_address', 'pickup_address')
      .leftJoinAndSelect('tender.dropoff_address', 'dropoff_address')
      .leftJoinAndSelect('tender.medias', 'medias')
      .leftJoinAndSelect('tender.tender_image', 'tender_image')
      .leftJoin('tender.bids', 'bids');

    if (exclude_already_bidded && organization_bidder_id) {
      query
        .andWhere((qb) => {
          const subQuery = qb
            .subQuery()
            .select('1') // (Step 2) Selects a constant value (1) instead of fetching actual data
            .from('bid', 'b') // (Step 3) Defines the subquery to check bids table
            .where('b.tender_id = tender.id') // (Step 4) Ensures we match the main query's tender ID
            .andWhere('b.bidder_id = :organization_bidder_id') // (Step 5) Filters by specific bidder
            .getQuery(); // Generates the SQL string

          return `NOT EXISTS (${subQuery})`; // (Step 6) Filters out tenders where this subquery finds a match
        })
        .setParameter('organization_bidder_id', organization_bidder_id);
    }

    if (exclude_expired) {
      query.andWhere('tender.bid_deadline > :current_date', {
        current_date: new Date(),
      });
    }

    if (price_min) {
      query.andWhere('tender.tender_budget_amount >= :price_min', {
        price_min,
      });
    }

    if (price_max) {
      query.andWhere('tender.tender_budget_amount <= :price_max', {
        price_max,
      });
    }

    if (location) {
      query.andWhere('dropoff_address.country ILIKE :location', {
        location: `%${location}%`,
      });
    }

    if (industry_id) {
      query.andWhere('industries.id = :industry_id', { industry_id });
    }

    if (size_id) {
      query.andWhere('size.id = :size_id', { size_id });
    }

    if (company_type_id) {
      query.andWhere('created_by.company_type_id = :company_type_id', {
        company_type_id,
      });
    }

    if (search) {
      query.andWhere('tender.title ILIKE :search', { search: `%${search}%` });
    }

    if (tender_status) {
      query.andWhere('tender.tender_status = :tender_status', {
        tender_status,
      });
    }

    if (!exclude_mine && created_by_id) {
      query.andWhere('tender.created_by_id = :created_by_id', {
        created_by_id,
      });
    }

    if (exclude_mine && created_by_id) {
      query.andWhere('tender.created_by_id != :created_by_id', {
        created_by_id,
      });
    }

    if (exclude_archived) {
      query.andWhere('tender.is_archived != :is_archived', {
        is_archived: true,
      });
    }

    if (start_date) {
      query.andWhere('tender.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('tender.created_at <= :end_date', { end_date });
    }

    query
      .distinctOn(['tender.created_at'])
      .addOrderBy('tender.created_at', 'DESC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate(query, paginationOptions);
  }

  async findOne(currentUser: User, { id }: ParamIdDto) {
    const tender = await this.tenderRepository.findOne({
      where: { id },
      relations: [
        'created_by',
        'size',
        'industries',
        'pickup_address',
        'dropoff_address',
        'medias',
        'created_by',
      ],
    });

    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    const bid = await this.bidRepository.findOne({
      where: { tender: { id: tender.id }, bidder: { id: currentUser.id } },
    });

    return { ...tender, bid };
  }

  async update(
    { id }: ParamIdDto,
    currentUser: User,
    updateTenderDto: UpdateTenderDto,
  ) {
    const tender = await this.tenderRepository.findOne({
      where: { id, created_by: { id: currentUser.id } },
    });

    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    TenderPolicyFactory.canUpdate(tender.tender_status, updateTenderDto);

    const {
      industry_ids,
      size_id,
      pickup_address_id,
      dropoff_address_id,
      tender_image,
      ...rest
    } = updateTenderDto;

    Object.assign(tender, rest);

    if (industry_ids) {
      const industries = await this.industryRepository.find({
        where: { id: In(industry_ids), status: IndustryStatus.ACTIVE },
      });

      if (industries.length < 1) {
        throw new BadRequestException(
          'Please select at least one valid industry',
        );
      }

      tender.industries = industries;
    }

    if (size_id) {
      const size = await this.sizeRepository.findOne({
        where: { id: size_id, status: SizeStatus.ACTIVE },
      });

      if (!size) {
        throw new BadRequestException('Size not found');
      }

      tender.size = size;
    }

    if (pickup_address_id) {
      const pickupAddress = await this.addressRepository.findOne({
        where: { id: pickup_address_id, created_by: { id: currentUser.id } },
      });

      if (!pickupAddress) {
        throw new BadRequestException('Pickup address not found');
      }

      tender.pickup_address = pickupAddress;
    }

    if (updateTenderDto.tender_image) {
      if (tender.tender_image)
        await this.mediaService.deleteMedia(currentUser, {
          id: tender.tender_image.id,
        });
      tender.tender_image = await this.mediaService.createMedia(currentUser, {
        file: updateTenderDto.tender_image,
        folder_path: TenderS3Paths.TENDER_IMAGE,
      });
    }

    if (dropoff_address_id) {
      const dropoffAddress = await this.addressRepository.findOne({
        where: { id: dropoff_address_id, created_by: { id: currentUser.id } },
      });

      if (!dropoffAddress) {
        throw new BadRequestException('Dropoff address not found');
      }
      tender.dropoff_address = dropoffAddress;
    }

    return tender.save();
  }

  async createAttachment(
    currentUser: User,
    tender_id: string,
    createAttachmentDto: CreateAttachmentDto,
  ) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: tender_id,
        tender_status: TenderStatus.DRAFT,
        created_by: {
          id: currentUser.id,
        },
      },
    });

    if (!tender) {
      throw new BadRequestException(
        'Attachment can only be attached when the tender is in draft state',
      );
    }

    const url = await this.s3Service.uploadFile(
      createAttachmentDto.file,
      'tender',
    );

    const attachment = await this.mediaService.createMedia(currentUser, {
      file: createAttachmentDto.file,
      folder_path: 'tender',
    });

    attachment.tender = tender;

    return attachment.save();
  }

  async deleteAttachment(
    currentUser: User,
    tender_id: string,
    attachment_id: string,
  ) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: tender_id,
        tender_status: TenderStatus.DRAFT,
        created_by: {
          id: currentUser.id,
        },
      },
    });

    if (!tender) {
      throw new BadRequestException(
        'Attachment can only be deleted when the tender is in draft state',
      );
    }

    return await this.mediaService.deleteMedia(currentUser, {
      id: attachment_id,
    });
  }

  async manageStatus(
    currentUser: User,
    { id }: ParamIdDto,
    manageStatusDto: ManageStatusDto,
  ) {
    const tender = await this.tenderRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        created_by: true,
      },
    });

    if (!tender) {
      throw new NotFoundException('Tender not found');
    }

    const bid = await this.bidRepository.findOne({
      where: {
        tender: {
          id: tender.id,
        },
        bidder: {
          id: currentUser.id,
        },
        status: BidStatus.ACCEPTED,
      },
    });

    let userRole: TenderStatusCanBeUpdatedBy;
    if ([UserRole.SUPER_ADMIN, UserRole.ADMIN].includes(currentUser.role)) {
      userRole = currentUser.role as unknown as TenderStatusCanBeUpdatedBy;
    } else if (tender.created_by.id === currentUser.id) {
      userRole = TenderStatusCanBeUpdatedBy.CREATOR_ORGANIZATION;
    } else if (bid) {
      userRole = TenderStatusCanBeUpdatedBy.BIDDING_ORGANIZATION;
    }

    ManageTenderStatusPolicyFactory.canUpdateStatus(
      tender.tender_status, // old status
      manageStatusDto.tender_status, // new status
      userRole,
    );

    tender.tender_status = manageStatusDto.tender_status;

    await tender.save();

    // Notify all Admins & Super Admins when tender is pending
    if (manageStatusDto.tender_status === TenderStatus.PENDING_APPROVAL) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.role IN (:...roles)', {
          roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        })
        .andWhere('user.deleted_at IS NULL')
        .getMany();

      await this.sendNotificationToAdmin(users, tender);
    }

    // Notify Admins & Super Admins (except the current user) when tender is approved, rejected, or inactive
    if (
      [
        TenderStatus.APPROVED,
        TenderStatus.REJECTED,
        TenderStatus.IN_ACTIVE,
      ].includes(manageStatusDto.tender_status)
    ) {
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.role IN (:...roles)', {
          roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
        })
        .andWhere('user.deleted_at IS NULL')
        .andWhere('user.id != :userId', { userId: currentUser.id })
        .getMany();

      await this.sendNotificationToAdminsWhenTenderApprovedOrRejectOrInActice(
        users,
        tender,
        currentUser,
      );
    }

    if (manageStatusDto.tender_status === TenderStatus.RECEIVED) {
      const bid = await this.bidRepository.findOne({
        where: {
          tender: {
            id: tender.id,
            created_by: { id: currentUser.id },
          },
          status: BidStatus.ACCEPTED,
        },
        relations: {
          bidder: true,
        },
      });

      if (!bid) {
        throw new NotFoundException('Bid not found');
      }

      const transaction = await this.transactionRepository.findOne({
        where: {
          bid: {
            id: bid.id,
          },
        },
      });

      if (!transaction) {
        throw new NotFoundException('Transaction not found');
      }

      await this.earningService.createBidTransfer(transaction.id);
      await this.sendNotificationToBidderWhenTenderReceived(
        bid,
        tender,
        currentUser,
      );
    }

    // Always notify the organization when tender status changes
    if (
      ![TenderStatus.IN_TRANSACTION, TenderStatus.IN_PROGRESS].includes(
        manageStatusDto.tender_status,
      )
    ) {
      await this.tenderStatusChangeNotificationToOrganization(
        tender,
        currentUser,
      );
    }

    return tender;
  }

  async findBidWithNonCreatedStatus(currentUser: User, { id }: ParamIdDto) {
    const bid = await this.bidRepository.findOne({
      where: {
        status: In([BidStatus.IN_TRANSACTION, BidStatus.ACCEPTED]),
        tender: {
          id: id,
          created_by: {
            id: currentUser.id,
          },
        },
      },
      relations: {
        bidder: true,
        tender: {
          created_by: true,
        },
      },
    });

    if (!bid) {
      throw new NotFoundException('Bid not found');
    }

    return bid;
  }

  remove(id: number) {
    return `This action removes a #${id} tender`;
  }

  async getTenderStates(
    currentUser: User,
    organization_id?: string,
    year?: number,
  ) {
    if (
      organization_id &&
      ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role) &&
      organization_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }
    const allStatuses = Object.values(TenderStatus);
    const tenders = this.tenderRepository
      .createQueryBuilder('tenders')
      .select([
        ...allStatuses.map(
          (status) =>
            `COUNT(CASE WHEN tenders.tender_status = '${status}' THEN 1 ELSE null END) as ${status}`,
        ),
        'COUNT(*) as total_count',
      ]);

    if (organization_id) {
      tenders.andWhere('tenders.created_by_id = :organization_id', {
        organization_id,
      });
    }
    if (year) {
      tenders.andWhere('EXTRACT(YEAR FROM tenders.created_at) = :year', {
        year,
      });
    }
    return await tenders.getRawOne();
  }

  async getTenderGraphStates(
    currentUser: User,
    getTendersGraphDto: GetTendersGraphDto,
  ) {
    const { organization_id, year } = getTendersGraphDto;
    if (
      organization_id &&
      ![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role) &&
      organization_id !== currentUser.id
    ) {
      throw new ForbiddenException(
        'You are not allowed to access this resource',
      );
    }

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

    const spendingQuery = this.transactionRepository.createQueryBuilder('transactions')
      .select('EXTRACT(MONTH FROM transactions.created_at)::int', 'month')
      .addSelect('SUM(transactions.total_amount_charged)', 'spending')
      .where('transactions.status = :status', {
        status: TransactionStatus.SUCCESS,
      })
      .andWhere('EXTRACT(YEAR FROM transactions.created_at) = :year', { year })
      .groupBy('month')

    const earningsQuery = this.earningRepository.createQueryBuilder('earnings')
      .select('EXTRACT(MONTH FROM earnings.created_at)::int', 'month')
      .addSelect('SUM(earnings.total_earned)', 'earnings')
      .where('earnings.status = :status', { status: EarningsStatus.PAID })
      .andWhere('EXTRACT(YEAR FROM earnings.created_at) = :year', { year })
      .groupBy('month')


    if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(currentUser.role)) {
      spendingQuery.andWhere('transactions.user = :userId', { userId: currentUser.id })
      earningsQuery.andWhere('earnings.user = :userId', { userId: currentUser.id })
    }

    const spending = await spendingQuery.getRawMany();
    const earnings = await earningsQuery.getRawMany();

    // Transform results into required format with all months
    const monthlyData = months.map((monthName, index) => {
      const monthNumber = index + 1;
      const spendingData = spending.find(s => parseInt(s.month) === monthNumber);
      const earningData = earnings.find(e => parseInt(e.month) === monthNumber);

      return {
        month: monthName,
        spending: parseInt(spendingData?.spending || '0'),
        earning: parseInt(earningData?.earnings || '0'),
      };
    });

    return monthlyData;
  }

  async sendNotificationToAdmin(users: User[], tender: Tender) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: users.map((item) => item.id),
      title: 'New Tender Submission',
      message: 'A new tender has been submitted. Please review and approve it.',
      template: EmailTemplate.NEW_TENDER_POSTED,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.TENDER,
      entity_id: tender.id,
      meta_data: {
        organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
        tender_title: tender.title,
        submission_date: dayjs(tender.created_at).format('MMMM D, YYYY'),
        approval_link: `${this.configService.get('FRONTEND_URL')}/admin/tenders/${tender.id}`,
      },
    });
  }

  async sendNotificationToAdminsWhenTenderApprovedOrRejectOrInActice(
    users: User[],
    tender: Tender,
    currentUser: User,
  ) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: users.map((item) => item.id),
      title: `Tender ${tender.tender_status.toUpperCase()} by ${currentUser.first_name} ${currentUser.last_name}`,
      message: `The tender "${tender.title}" has been ${tender.tender_status} by ${currentUser.first_name} ${currentUser.last_name}.`,
      template: EmailTemplate.TENDER_STATUS_UPDATED_FOR_ADMINS,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.TENDER,
      entity_id: tender.id,
      meta_data: {
        organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
        tender_title: tender.title,
        action_taken_by: `${currentUser.first_name} ${currentUser.last_name}`,
        tender_status: tender.tender_status.toUpperCase(),
        status_class:
          tender.tender_status === 'approved' ? 'approved' : 'rejected',
        action_date: dayjs().format('MMMM D, YYYY'),
        approval_link: `${this.configService.get('FRONTEND_URL')}/admin/tenders/${tender.id}`,
      },
    });
  }

  async sendNotificationToBidderWhenTenderReceived(
    bid: Bid,
    tender: Tender,
    currentUser: User,
  ) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [tender.created_by.id],
      title: 'Tender Marked as Received',
      message: `The tender titled "${tender.title}" has been marked as received by ${currentUser.first_name} ${currentUser.last_name}.`,
      template: EmailTemplate.TENDER_RECEIVED_NOTIFICATION,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.BID,
      entity_id: bid.id,
      meta_data: {
        organization_name: `${bid.bidder.first_name} ${bid.bidder.last_name}`,
        tender_title: tender.title,
        posted_by: `${currentUser.first_name} ${currentUser.last_name}`,
        tender_url: `${this.configService.get('FRONTEND_URL')}/organization/tenders/${tender.id}`,
      },
    });
  }

  async tenderStatusChangeNotificationToOrganization(
    tender: Tender,
    currentUser: User,
  ) {
    this.eventEmitter.emitAsync('create-send-notification', {
      user_ids: [tender.created_by.id],
      title: 'Tender Approval Update',
      message: `Your tender "${tender.title}" has been ${tender.tender_status}.`,
      template: EmailTemplate.TENDER_APPROVAL,
      notification_type: NotificationType.TRANSACTION,
      is_displayable: true,
      channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
      bypass_user_preferences: true,
      entity_type: NotificationEntityType.TENDER,
      entity_id: tender.id,
      meta_data: {
        organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
        tender_title: tender.title,
        tender_status: tender.tender_status,
        tender_status_label: tender.tender_status.toUpperCase(),
        delivered_by: `${currentUser.first_name} ${currentUser.last_name}`,
        tender_url: `${this.configService.get('FRONTEND_URL')}/organization/tenders/${tender.id}`,
      },
    });
  }
}
