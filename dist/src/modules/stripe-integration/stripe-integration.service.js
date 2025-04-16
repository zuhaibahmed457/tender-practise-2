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
exports.StripeIntegrationService = void 0;
const common_1 = require("@nestjs/common");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const typeorm_2 = require("typeorm");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const bid_entity_1 = require("../bid/entities/bid.entity");
const tender_entity_1 = require("../tender/entities/tender.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const notification_entity_1 = require("../notifications/entities/notification.entity");
let StripeIntegrationService = class StripeIntegrationService {
    constructor(userRepository, transactionManagerService, eventEmitter) {
        this.userRepository = userRepository;
        this.transactionManagerService = transactionManagerService;
        this.eventEmitter = eventEmitter;
    }
    async processPaymentIntentSuccess(event) {
        const eventDataObject = event.data.object;
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const transaction = await queryRunner.manager.findOne(transaction_entity_1.Transaction, {
                where: {
                    stripe_payment_intent_id: eventDataObject.id,
                    status: transaction_entity_1.TransactionStatus.PENDING,
                    bid: {
                        status: bid_entity_1.BidStatus.IN_TRANSACTION,
                        id: eventDataObject.metadata.bid_id,
                    },
                },
                relations: {
                    user: true,
                    bid: {
                        tender: {
                            created_by: true,
                        },
                        bidder: true,
                    },
                },
            });
            if (!transaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            transaction.status = transaction_entity_1.TransactionStatus.SUCCESS;
            transaction.bid.status = bid_entity_1.BidStatus.ACCEPTED;
            transaction.bid.tender.tender_status = tender_entity_1.TenderStatus.IN_PROGRESS;
            await queryRunner.manager.save(transaction_entity_1.Transaction, transaction);
            await queryRunner.manager.save(bid_entity_1.Bid, transaction.bid);
            await queryRunner.manager.save(tender_entity_1.Tender, transaction.bid.tender);
            const adminsAndSuperAdmins = await queryRunner.manager.find(user_entity_1.User, {
                where: {
                    role: user_entity_1.UserRole.ADMIN,
                    status: user_entity_1.UserStatus.ACTIVE,
                    deleted_at: (0, typeorm_2.IsNull)(),
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: adminsAndSuperAdmins.map((admin) => admin.id),
                title: 'Bid Accepted - Payment Processed',
                message: `A bid has been accepted on the tender "${transaction.bid.tender.title}".`,
                template: email_template_enum_1.EmailTemplate.BID_ACCEPTED_ADMIN,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.TRANSACTION,
                entity_id: transaction.id,
                meta_data: {
                    tender_title: transaction.bid.tender.title,
                    tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
                    bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
                    platform_fee: `$${Number(transaction.platform_amount).toFixed(2)}`,
                    total_amount: `$${Number(transaction.total_amount_charged).toFixed(2)}`,
                    stripe_payment_intent_id: transaction.stripe_payment_intent_id,
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: [transaction.bid.bidder.id],
                title: 'Bid Accepted',
                message: `Your bid has been accepted on the tender "${transaction.bid.tender.title}". Proceed to delivering the tender`,
                template: email_template_enum_1.EmailTemplate.BID_ACCEPTED_BIDDER,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.BID,
                entity_id: transaction.bid.id,
                meta_data: {
                    user_name: `${transaction.bid.bidder.first_name} ${transaction.bid.bidder.last_name}`,
                    tender_title: transaction.bid.tender.title,
                    tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
                    bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
                },
            });
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: [transaction.bid.tender.created_by.id],
                title: 'Bid Accepted - Payment Processed',
                message: `Bid has been accepted on the tender "${transaction.bid.tender.title}".`,
                template: email_template_enum_1.EmailTemplate.BID_ACCEPTED_POSTER,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.TRANSACTION,
                entity_id: transaction.id,
                meta_data: {
                    tender_title: transaction.bid.tender.title,
                    tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
                    bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
                    platform_fee: `$${Number(transaction.platform_amount).toFixed(2)}`,
                    total_amount: `$${Number(transaction.total_amount_charged).toFixed(2)}`,
                    stripe_payment_intent_id: transaction.stripe_payment_intent_id,
                    error_message: transaction.failure_reason,
                },
            });
        });
    }
    async processPaymentIntentFailed(event) {
        const eventDataObject = event.data.object;
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const transaction = await queryRunner.manager.findOne(transaction_entity_1.Transaction, {
                where: {
                    stripe_payment_intent_id: eventDataObject.id,
                    status: transaction_entity_1.TransactionStatus.PENDING,
                    bid: {
                        status: bid_entity_1.BidStatus.IN_TRANSACTION,
                        id: eventDataObject.metadata.bid_id,
                    },
                },
                relations: {
                    user: true,
                    bid: {
                        tender: true,
                    },
                },
            });
            if (!transaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            transaction.failure_reason = eventDataObject.last_payment_error.message;
            transaction.status = transaction_entity_1.TransactionStatus.FAILED;
            transaction.bid.status = bid_entity_1.BidStatus.CREATED;
            transaction.bid.tender.tender_status = tender_entity_1.TenderStatus.APPROVED;
            await queryRunner.manager.save(transaction_entity_1.Transaction, transaction);
            await queryRunner.manager.save(bid_entity_1.Bid, transaction.bid);
            await queryRunner.manager.save(tender_entity_1.Tender, transaction.bid.tender);
            await this.eventEmitter.emitAsync('create-send-notification', {
                user_ids: [transaction.bid.tender.created_by.id],
                title: 'Bid Acceptance Failed',
                message: `Bid acceptance failed on the tender "${transaction.bid.tender.title}".`,
                template: email_template_enum_1.EmailTemplate.BID_ACCEPTANCE_FAILED_POSTER,
                notification_type: notification_entity_1.NotificationType.TRANSACTION,
                is_displayable: true,
                channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
                bypass_user_preferences: false,
                entity_type: notification_entity_1.NotificationEntityType.TRANSACTION,
                entity_id: transaction.id,
                meta_data: {
                    tender_title: transaction.bid.tender.title,
                    tender_amount: `$${Number(transaction.bid.tender.tender_budget_amount).toFixed(2)}`,
                    bid_amount: `$${Number(transaction.bid.amount).toFixed(2)}`,
                    platform_fee: `$${Number(transaction.platform_amount).toFixed(2)}`,
                    total_amount: `$${Number(transaction.total_amount_charged).toFixed(2)}`,
                    stripe_payment_intent_id: transaction.stripe_payment_intent_id,
                    error_message: transaction.failure_reason,
                },
            });
        });
    }
    create(createStripeIntegrationDto) {
        return 'This action adds a new stripeIntegration';
    }
    findAll() {
        return `This action returns all stripeIntegration`;
    }
    findOne(id) {
        return `This action returns a #${id} stripeIntegration`;
    }
    update(id, updateStripeIntegrationDto) {
        return `This action updates a #${id} stripeIntegration`;
    }
    remove(id) {
        return `This action removes a #${id} stripeIntegration`;
    }
    async markUserConnectAccount(eventDataObject, status) {
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const user = await this.userRepository.findOne({
                where: {
                    stripe_connect_account_id: eventDataObject.id,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            user.connect_account_status = status;
            await queryRunner.manager.save(user);
        });
    }
};
exports.StripeIntegrationService = StripeIntegrationService;
exports.StripeIntegrationService = StripeIntegrationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        transaction_manager_service_1.TransactionManagerService,
        event_emitter_1.EventEmitter2])
], StripeIntegrationService);
//# sourceMappingURL=stripe-integration.service.js.map