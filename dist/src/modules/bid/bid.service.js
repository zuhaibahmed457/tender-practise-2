"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tender_entity_1 = require("../tender/entities/tender.entity");
const bid_entity_1 = require("./entities/bid.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const update_bid_factory_1 = require("./factories/update-bid.factory");
const event_emitter_1 = require("@nestjs/event-emitter");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const get_all_bids_factory_1 = require("./factories/get-all-bids.factory");
const get_all_bids_policy_1 = require("./policies/get-all-bids.policy");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const dayjs = require("dayjs");
const config_1 = require("@nestjs/config");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const stripe_1 = require("stripe");
const platform_fee_entity_1 = require("../platform-fees/entities/platform-fee.entity");
const payment_method_entity_1 = require("../payment-methods/entities/payment-method.entity");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
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
let BidService = class BidService {
    constructor(tenderRepository, bidRepository, userRepository, stripe, eventEmitter, configService, transactionManagerService) {
        this.tenderRepository = tenderRepository;
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.stripe = stripe;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.transactionManagerService = transactionManagerService;
    }
    async create(currentUser, createBidDto) {
        if (currentUser.connect_account_status !== user_entity_1.ConnectAccountStatus.CONNECTED) {
            throw new common_1.BadRequestException('You must connect your stripe connect account to place a bid');
        }
        const tender = await this.tenderRepository.findOne({
            where: { id: createBidDto.tender_id },
            relations: {
                created_by: true,
            },
        });
        if (!tender) {
            throw new common_1.NotFoundException('Tender not found');
        }
        if (tender.created_by.id === currentUser.id)
            throw new common_1.BadRequestException(`You cannot bid on your own tender`);
        if (tender.tender_status !== tender_entity_1.TenderStatus.APPROVED) {
            throw new common_1.BadRequestException('Tender is not approved and hence you cannot be bidded');
        }
        if (tender.is_archived) {
            throw new common_1.BadRequestException('Tender is archived');
        }
        if (tender.bid_deadline < new Date()) {
            throw new common_1.BadRequestException('Tender deadline has passed');
        }
        const existingBid = await this.bidRepository.findOne({
            where: {
                tender: { id: createBidDto.tender_id },
                bidder: { id: currentUser.id },
            },
        });
        if (existingBid) {
            throw new common_1.BadRequestException('You have already placed a bid for this tender');
        }
        const bid = this.bidRepository.create({
            ...createBidDto,
            bidder: currentUser,
            tender: tender,
            priority: 0,
        });
        await this.sendBidNotificationToCreator(bid, tender, currentUser);
        await this.sendConfirmationEmailToBidder(bid, tender, currentUser);
        await bid.save();
        await this.bidRepository.increment({
            priority: (0, typeorm_2.MoreThanOrEqual)(bid.priority),
            id: (0, typeorm_2.Not)(bid.id),
            tender: { id: bid.tender.id },
        }, 'priority', 1);
        return bid;
    }
    async findAll(currentUser, getAllBidsDto) {
        const { page, per_page, search, tender_id, bid_status, bidder_id, poster_id, start_date, end_date, delivery_date_start, delivery_date_end, } = getAllBidsDto;
        get_all_bids_factory_1.GetAllBidsFactory.canFilter([user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN].includes(currentUser.role)
            ? currentUser.role
            : poster_id === currentUser.id
                ? get_all_bids_policy_1.BidStatusCanBeRetrieveBy.CREATOR_ORGANIZATION
                : get_all_bids_policy_1.BidStatusCanBeRetrieveBy.BIDDING_ORGANIZATION, getAllBidsDto, poster_id === currentUser.id);
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
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, paginationOptions);
    }
    async findOne({ id }, currentUser) {
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
        if (!bid)
            throw new common_1.NotFoundException(`Bid not found`);
        return bid;
    }
    async update({ id }, updateBidDto) {
        const bid = await this.bidRepository.findOne({
            where: {
                id,
            },
            relations: {
                bidder: true,
                tender: true,
            },
        });
        if (!bid)
            throw new common_1.NotFoundException(`Bid not found`);
        if (bid.tender.bid_deadline < updateBidDto.delivery_date) {
            throw new common_1.BadRequestException('Delivery date cannot be before the tender deadline');
        }
        update_bid_factory_1.BidPolicyFactory.canUpdate(bid.status, updateBidDto);
        const bidOldPriority = bid.priority;
        const bidNewPriority = updateBidDto.priority;
        Object.assign(bid, updateBidDto);
        bid.priority = updateBidDto.priority ?? bidOldPriority;
        await bid.save();
        if (typeof bidNewPriority === 'number' && bidNewPriority > bidOldPriority) {
            await this.bidRepository.decrement({
                priority: (0, typeorm_2.Between)(bidOldPriority + 1, bidNewPriority),
                id: (0, typeorm_2.Not)(bid.id),
                tender: { id: bid.tender.id },
            }, 'priority', 1);
        }
        else if (typeof bidNewPriority === 'number' &&
            bidNewPriority < bidOldPriority) {
            await this.bidRepository.increment({
                priority: (0, typeorm_2.Between)(bidNewPriority, bidOldPriority - 1),
                id: (0, typeorm_2.Not)(bid.id),
                tender: { id: bid.tender.id },
            }, 'priority', 1);
        }
        return bid;
    }
    async acceptBid({ id }, currentUser) {
        return await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const bid = await queryRunner.manager.findOne(bid_entity_1.Bid, {
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
            if (!bid)
                throw new common_1.NotFoundException(`Bid not found`);
            const bidNotInCreatedStateExists = await queryRunner.manager.findOne(bid_entity_1.Bid, {
                where: {
                    tender: { id: bid.tender.id },
                    status: (0, typeorm_2.Not)(bid_entity_1.BidStatus.CREATED),
                },
            });
            if (bidNotInCreatedStateExists) {
                throw new common_1.BadRequestException('Their is already a bid in a non created state for this tender');
            }
            const defaultPaymentMethod = await queryRunner.manager.findOne(payment_method_entity_1.PaymentMethod, {
                where: {
                    is_default: true,
                    user: {
                        id: currentUser.id,
                    },
                },
            });
            if (!defaultPaymentMethod) {
                throw new common_1.BadRequestException('Please add payment method first');
            }
            const platformFee = await queryRunner.manager.findOne(platform_fee_entity_1.PlatformFee, {
                where: {
                    label: platform_fee_entity_1.PlatformLabel.TENDER_POSTER_FEE,
                },
            });
            let bidAmount = +bid.amount;
            let platformFeeAmount = 0;
            if (platformFee && platformFee.type === platform_fee_entity_1.PlatformFeeType.PERCENTAGE) {
                platformFeeAmount = (bidAmount * platformFee.fee) / 100;
            }
            else if (platformFee && platformFee.type === platform_fee_entity_1.PlatformFeeType.FIXED) {
                platformFeeAmount = +platformFee.fee;
            }
            const totalAmountToBeCharged = Number((bidAmount + platformFeeAmount).toFixed(2));
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Number((totalAmountToBeCharged * 100).toFixed(2)),
                currency: 'usd',
                customer: currentUser.stripe_customer_id,
                payment_method_types: [defaultPaymentMethod.type],
                payment_method: defaultPaymentMethod.stripe_payment_method_id,
                ...(defaultPaymentMethod.type === payment_method_entity_1.PaymentMethodType.BANK_ACCOUNT && {
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
            const transaction = queryRunner.manager.create(transaction_entity_1.Transaction, {
                total_amount_charged: totalAmountToBeCharged,
                bid_amount: +(bidAmount.toFixed(2)),
                platform_amount: +(platformFeeAmount.toFixed(2)),
                payment_method: defaultPaymentMethod,
                status: transaction_entity_1.TransactionStatus.PENDING,
                stripe_payment_intent_id: paymentIntent.id,
                user: currentUser,
                bid: bid,
            });
            await queryRunner.manager.save(transaction_entity_1.Transaction, transaction);
            bid.status = bid_entity_1.BidStatus.IN_TRANSACTION;
            bid.tender.tender_status = tender_entity_1.TenderStatus.IN_TRANSACTION;
            await queryRunner.manager.save(tender_entity_1.Tender, bid.tender);
            await queryRunner.manager.save(bid_entity_1.Bid, bid);
            return bid;
        });
    }
    remove(id) {
        return `This action removes a #${id} bid`;
    }
    async getBidCounts(currentUser, organization_id) {
        if (currentUser.role === user_entity_1.UserRole.ORGANIZATION &&
            (!organization_id || organization_id !== currentUser.id)) {
            throw new common_1.ForbiddenException('You are not authorized to view this data');
        }
        const qb = this.bidRepository
            .createQueryBuilder('bid')
            .select([
            'COUNT(*) AS total',
            `SUM(CASE WHEN bid.status = '${bid_entity_1.BidStatus.ACCEPTED}' THEN 1 ELSE 0 END) AS accepted`,
            `SUM(CASE WHEN bid.status = '${bid_entity_1.BidStatus.IN_TRANSACTION}' THEN 1 ELSE 0 END) AS in_transaction`,
            `SUM(CASE WHEN bid.status = '${bid_entity_1.BidStatus.CREATED}' THEN 1 ELSE 0 END) AS created`,
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
    async getBidGraphStats(currentUser, year, organization_id) {
        if (currentUser.role === user_entity_1.UserRole.ORGANIZATION &&
            (!organization_id || organization_id !== currentUser.id)) {
            throw new common_1.ForbiddenException('You are not authorized to view this data');
        }
        const bids = await this.bidRepository
            .createQueryBuilder('bids')
            .select('EXTRACT(MONTH FROM bids.created_at)::int', 'month')
            .addSelect(`SUM(CASE WHEN bids.status = :created THEN 1 ELSE 0 END)`, 'created')
            .addSelect(`SUM(CASE WHEN bids.status = :inTransaction THEN 1 ELSE 0 END)`, 'in_transaction')
            .addSelect(`SUM(CASE WHEN bids.status = :accepted THEN 1 ELSE 0 END)`, 'accepted')
            .where('EXTRACT(YEAR FROM bids.created_at) = :year', { year })
            .andWhere('bids.deleted_at IS NULL')
            .andWhere('bids.bidder_id = :userId', { userId: currentUser.id })
            .setParameters({
            created: bid_entity_1.BidStatus.CREATED,
            inTransaction: bid_entity_1.BidStatus.IN_TRANSACTION,
            accepted: bid_entity_1.BidStatus.ACCEPTED,
        })
            .groupBy('month')
            .getRawMany();
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
    async sendBidNotificationToCreator(bid, tender, currentUser) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [tender.created_by.id],
            title: 'New Bid Received!',
            message: `Your tender "${tender.title}" has received a new bid from ${currentUser.first_name} ${currentUser.last_name}. Check the details now.`,
            template: email_template_enum_1.EmailTemplate.NEW_BID_RECEIVED,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.TENDER,
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
    async sendConfirmationEmailToBidder(bid, tender, currentUser) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [currentUser.id],
            title: 'Your Bid Has Been Submitted!',
            message: `You have successfully placed a bid on the tender "${tender.title}". We will notify you of any updates.`,
            template: email_template_enum_1.EmailTemplate.BID_SUBMISSION_CONFIRMATION,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL],
            bypass_user_preferences: false,
            entity_type: notification_entity_1.NotificationEntityType.BID,
            entity_id: bid.id,
            meta_data: {
                bidder_name: `${currentUser.first_name} ${currentUser.last_name}`,
                tender_title: tender.title,
                bid_date: dayjs(bid.created_at).format('MMMM D, YYYY'),
            },
        });
    }
};
exports.BidService = BidService;
exports.BidService = BidService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tender_entity_1.Tender)),
    __param(1, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_1.default,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService,
        transaction_manager_service_1.TransactionManagerService])
], BidService);
//# sourceMappingURL=bid.service.js.map