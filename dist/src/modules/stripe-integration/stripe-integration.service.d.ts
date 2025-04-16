import { CreateStripeIntegrationDto } from './dto/create-stripe-integration.dto';
import { UpdateStripeIntegrationDto } from './dto/update-stripe-integration.dto';
import Stripe from 'stripe';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { ConnectAccountStatus, User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
export declare class StripeIntegrationService {
    private readonly userRepository;
    private readonly transactionManagerService;
    private readonly eventEmitter;
    constructor(userRepository: Repository<User>, transactionManagerService: TransactionManagerService, eventEmitter: EventEmitter2);
    processPaymentIntentSuccess(event: Stripe.PaymentIntentSucceededEvent): Promise<void>;
    processPaymentIntentFailed(event: Stripe.PaymentIntentPaymentFailedEvent): Promise<void>;
    create(createStripeIntegrationDto: CreateStripeIntegrationDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateStripeIntegrationDto: UpdateStripeIntegrationDto): string;
    remove(id: number): string;
    markUserConnectAccount(eventDataObject: Stripe.Account, status: ConnectAccountStatus): Promise<void>;
}
