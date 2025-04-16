import { PaymentMethodsService } from './payment-methods.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import Stripe from 'stripe';
import { GetAllPaymentMethodsDto } from './dto/get-all-payment-methods.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class PaymentMethodsController {
    private readonly stripe;
    private readonly paymentMethodsService;
    constructor(stripe: Stripe, paymentMethodsService: PaymentMethodsService);
    create(currentUser: User, createPaymentMethodDto: CreatePaymentMethodDto): Promise<IResponse>;
    findAll(currentUser: User, getAllPaymentMethodsDto: GetAllPaymentMethodsDto): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, CurrentUser: User): Promise<{
        message: string;
        details: import("./entities/payment-method.entity").PaymentMethod;
    }>;
    update(id: string, updatePaymentMethodDto: UpdatePaymentMethodDto): string;
    markDefault(ParamIdDto: ParamIdDto, currentUser: User): Promise<{
        message: string;
    }>;
    remove(paramIdDto: ParamIdDto, CurrentUser: User): Promise<{
        message: string;
    }>;
}
