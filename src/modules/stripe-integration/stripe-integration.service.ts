import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStripeIntegrationDto } from './dto/create-stripe-integration.dto';
import { UpdateStripeIntegrationDto } from './dto/update-stripe-integration.dto';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectAccountStatus,
  User,
  UserRole,
  UserStatus,
} from '../users/entities/user.entity';
import { IsNull, Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
} from '../transactions/entities/transaction.entity';
import { Bid, BidStatus } from '../bid/entities/bid.entity';
import { Tender, TenderStatus } from '../tender/entities/tender.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EmailTemplate } from '../notifications/enums/email-template.enum';
import {
  NotificationChannel,
  NotificationEntityType,
  NotificationType,
} from '../notifications/entities/notification.entity';

@Injectable()
export class StripeIntegrationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly transactionManagerService: TransactionManagerService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async processPaymentIntentSuccess(event: Stripe.PaymentIntentSucceededEvent) {
    const eventDataObject = event.data.object;

    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const transaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            stripe_payment_intent_id: eventDataObject.id,
            status: TransactionStatus.PENDING,
            bid: {
              status: BidStatus.IN_TRANSACTION,
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
          throw new NotFoundException('Transaction not found');
        }

        transaction.status = TransactionStatus.SUCCESS;
        transaction.bid.status = BidStatus.ACCEPTED;
        transaction.bid.tender.tender_status = TenderStatus.IN_PROGRESS;

        await queryRunner.manager.save(Transaction, transaction);
        await queryRunner.manager.save(Bid, transaction.bid);
        await queryRunner.manager.save(Tender, transaction.bid.tender);

        const adminsAndSuperAdmins = await queryRunner.manager.find(User, {
          where: {
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            deleted_at: IsNull(),
          },
        });

        await this.eventEmitter.emitAsync('create-send-notification', {
          user_ids: adminsAndSuperAdmins.map((admin) => admin.id),
          title: 'Bid Accepted - Payment Processed',
          message: `A bid has been accepted on the tender "${transaction.bid.tender.title}".`,
          template: EmailTemplate.BID_ACCEPTED_ADMIN,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.TRANSACTION,
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
          template: EmailTemplate.BID_ACCEPTED_BIDDER,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.BID,
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
          template: EmailTemplate.BID_ACCEPTED_POSTER,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.TRANSACTION,
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
      },
    );
  }

  async processPaymentIntentFailed(
    event: Stripe.PaymentIntentPaymentFailedEvent,
  ) {
    const eventDataObject = event.data.object;

    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const transaction = await queryRunner.manager.findOne(Transaction, {
          where: {
            stripe_payment_intent_id: eventDataObject.id,
            status: TransactionStatus.PENDING,
            bid: {
              status: BidStatus.IN_TRANSACTION,
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
          throw new NotFoundException('Transaction not found');
        }

        transaction.failure_reason = eventDataObject.last_payment_error.message;
        transaction.status = TransactionStatus.FAILED;
        transaction.bid.status = BidStatus.CREATED;
        transaction.bid.tender.tender_status = TenderStatus.APPROVED;

        await queryRunner.manager.save(Transaction, transaction);
        await queryRunner.manager.save(Bid, transaction.bid);
        await queryRunner.manager.save(Tender, transaction.bid.tender);

        await this.eventEmitter.emitAsync('create-send-notification', {
          user_ids: [transaction.bid.tender.created_by.id],
          title: 'Bid Acceptance Failed',
          message: `Bid acceptance failed on the tender "${transaction.bid.tender.title}".`,
          template: EmailTemplate.BID_ACCEPTANCE_FAILED_POSTER,
          notification_type: NotificationType.TRANSACTION,
          is_displayable: true,
          channels: [NotificationChannel.EMAIL, NotificationChannel.PUSH],
          bypass_user_preferences: false,
          entity_type: NotificationEntityType.TRANSACTION,
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
      },
    );
  }

  create(createStripeIntegrationDto: CreateStripeIntegrationDto) {
    return 'This action adds a new stripeIntegration';
  }

  findAll() {
    return `This action returns all stripeIntegration`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripeIntegration`;
  }

  update(id: number, updateStripeIntegrationDto: UpdateStripeIntegrationDto) {
    return `This action updates a #${id} stripeIntegration`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripeIntegration`;
  }

  async markUserConnectAccount(
    eventDataObject: Stripe.Account,
    status: ConnectAccountStatus,
  ) {
    await this.transactionManagerService.executeInTransaction(
      async (queryRunner) => {
        const user = await this.userRepository.findOne({
          where: {
            stripe_connect_account_id: eventDataObject.id,
          },
        });

        if (!user) {
          throw new NotFoundException('User not found');
        }

        user.connect_account_status = status;

        await queryRunner.manager.save(user);
      },
    );
  }
}
