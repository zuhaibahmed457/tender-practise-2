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
exports.EarningsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const typeorm_2 = require("typeorm");
const stripe_1 = require("stripe");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const earning_entity_1 = require("./entities/earning.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const platform_fee_entity_1 = require("../platform-fees/entities/platform-fee.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const user_entity_1 = require("../users/entities/user.entity");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let EarningsService = class EarningsService {
    constructor(transactionRepository, earningRepository, stripe, transactionManagerService, eventEmitter) {
        this.transactionRepository = transactionRepository;
        this.earningRepository = earningRepository;
        this.stripe = stripe;
        this.transactionManagerService = transactionManagerService;
        this.eventEmitter = eventEmitter;
    }
    async createBidTransfer(transaction_id) {
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const transaction = await queryRunner.manager.findOne(transaction_entity_1.Transaction, {
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
            if (!transaction)
                throw new common_1.NotFoundException('Transaction not found');
            const transaction_payment_intent = await this.stripe.paymentIntents.retrieve(transaction.stripe_payment_intent_id);
            const platformFee = await queryRunner.manager.findOne(platform_fee_entity_1.PlatformFee, {
                where: {
                    label: platform_fee_entity_1.PlatformLabel.TENDER_BIDDER_FEE,
                },
            });
            let bidAmount = +transaction.bid.amount;
            let platformFeeAmount = 0;
            if (platformFee && platformFee.type === platform_fee_entity_1.PlatformFeeType.PERCENTAGE) {
                platformFeeAmount = (bidAmount * platformFee.fee) / 100;
            }
            else if (platformFee && platformFee.type === platform_fee_entity_1.PlatformFeeType.FIXED) {
                platformFeeAmount = +platformFee.fee;
            }
            const totalAmountToBeTransfer = Number((bidAmount - platformFeeAmount).toFixed(2));
            const transfer = await this.stripe.transfers.create({
                amount: totalAmountToBeTransfer * 100,
                currency: transaction_payment_intent.currency,
                source_transaction: transaction_payment_intent.latest_charge.toString(),
                destination: transaction.bid.bidder.stripe_connect_account_id,
                metadata: {
                    tender_id: transaction.bid.tender.id,
                    transaction: transaction.id,
                    bid: transaction.bid.id,
                },
            });
            const earning = queryRunner.manager.create(earning_entity_1.Earning, {
                bid: transaction.bid,
                transaction: transaction,
                tender: transaction.bid.tender,
                stripe_transfer_payment_intent_id: transfer.id,
                total_earned: +(Number(transaction.bid.amount) - Number(transaction.platform_amount)).toFixed(2),
                platform_amount: +Number(transaction.platform_amount).toFixed(2),
                bid_amount: +Number(transaction.bid.amount).toFixed(2),
                status: earning_entity_1.EarningsStatus.PAID,
                user: transaction.bid.bidder,
            });
            const adminsAndSuperAdmins = await queryRunner.manager.find(user_entity_1.User, {
                where: {
                    role: user_entity_1.UserRole.ADMIN,
                    status: user_entity_1.UserStatus.ACTIVE,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: adminsAndSuperAdmins.map((admin) => admin.id),
                title: 'Bid Amount Transferred - Payment Processed',
                message: `A bid amount has been transferred on the tender "${transaction.bid.tender.title}".`,
                template: email_template_enum_1.EmailTemplate.BID_AMOUNT_TRANSFER_ADMINS,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.EARNING,
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
                template: email_template_enum_1.EmailTemplate.BID_AMOUNT_TRANSFER_BIDDER,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.EARNING,
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
        });
    }
    async handleEarningsTransferFailed(transaction_id) {
        const earning = await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const earning = await queryRunner.manager.findOne(earning_entity_1.Earning, {
                where: {
                    transaction: { id: transaction_id },
                },
            });
            earning.status = earning_entity_1.EarningsStatus.REVERSED;
            return await queryRunner.manager.save(earning);
        });
        return earning;
    }
    async findAll(getAllEarningDto, currentUser) {
        const { status, organization_id, start_date, end_date, page, per_page, search, role, } = getAllEarningDto;
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            organization_id &&
            organization_id !== currentUser.id) {
            throw new common_1.ForbiddenException('You are not allowed to access Earnings of other users');
        }
        const query = this.earningRepository
            .createQueryBuilder('earning')
            .leftJoinAndSelect('earning.user', 'user')
            .leftJoinAndSelect('earning.bid', 'bid')
            .leftJoinAndSelect('earning.tender', 'tender')
            .leftJoinAndSelect('earning.transaction', 'transaction');
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role)) {
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
            query.andWhere(`(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search OR tender.title ILIKE :search)`, { search: `%${search}%` });
        }
        if (start_date) {
            query.andWhere('earning.created_at >= :start_date', { start_date });
        }
        if (end_date) {
            query.andWhere('earning.created_at <= :end_date', { start_date });
        }
        query.orderBy('earning.created_at', 'DESC');
        const paginationOption = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOption);
    }
    async getTotalEarnings(currentUser, organization_id) {
        if (currentUser.role === user_entity_1.UserRole.ORGANIZATION &&
            (!organization_id || organization_id !== currentUser.id)) {
            throw new common_1.ForbiddenException('You do not have permission to view earnings for this organization');
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
};
exports.EarningsService = EarningsService;
exports.EarningsService = EarningsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(1, (0, typeorm_1.InjectRepository)(earning_entity_1.Earning)),
    __param(2, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_1.default,
        transaction_manager_service_1.TransactionManagerService,
        event_emitter_1.EventEmitter2])
], EarningsService);
//# sourceMappingURL=earnings.service.js.map