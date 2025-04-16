import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User } from '../users/entities/user.entity';
import { PaymentMethod } from './entities/payment-method.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { GetAllPaymentMethodsDto } from './dto/get-all-payment-methods.dto';
import { TransactionManagerService } from 'src/shared/services/transaction-manager.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class PaymentMethodsService {
    private readonly paymentMethodRepository;
    private readonly usersRepository;
    private readonly stripe;
    private readonly transactionManagerService;
    constructor(paymentMethodRepository: Repository<PaymentMethod>, usersRepository: Repository<User>, stripe: Stripe, transactionManagerService: TransactionManagerService);
    create(currentUser: User, createPaymentMethodDto: CreatePaymentMethodDto): Promise<{
        setup_intent_client_secret: string;
    }>;
    findAll(currentUser: User, getAllPaymentMethodsDto: GetAllPaymentMethodsDto): Promise<import("nestjs-typeorm-paginate").Pagination<PaymentMethod, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<PaymentMethod>;
    update(id: number, updatePaymentMethodDto: UpdatePaymentMethodDto): string;
    markDefault({ id }: ParamIdDto, currentUser: User): Promise<PaymentMethod>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<PaymentMethod>;
    savePaymentMethod(paymentMethod: Stripe.PaymentMethod): Promise<void>;
}
