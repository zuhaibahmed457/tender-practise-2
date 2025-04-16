import { StripeIntegrationService } from './stripe-integration.service';
import { CreateStripeIntegrationDto } from './dto/create-stripe-integration.dto';
import { UpdateStripeIntegrationDto } from './dto/update-stripe-integration.dto';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { EarningsService } from '../earnings/earnings.service';
export declare class StripeIntegrationController {
    private readonly stripe;
    private readonly stripeIntegrationService;
    private readonly configService;
    private readonly paymentMethodsService;
    private readonly earningService;
    constructor(stripe: Stripe, stripeIntegrationService: StripeIntegrationService, configService: ConfigService, paymentMethodsService: PaymentMethodsService, earningService: EarningsService);
    platformWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
    paymentMethodWebhook(req: Request, res: Response, signature: string): Promise<Response<any, Record<string, any>>>;
    create(createStripeIntegrationDto: CreateStripeIntegrationDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateStripeIntegrationDto: UpdateStripeIntegrationDto): string;
    remove(id: string): string;
}
