import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Res,
  Headers,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { StripeIntegrationService } from './stripe-integration.service';
import { CreateStripeIntegrationDto } from './dto/create-stripe-integration.dto';
import { UpdateStripeIntegrationDto } from './dto/update-stripe-integration.dto';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ConnectAccountStatus } from '../users/entities/user.entity';
import { PaymentMethodsService } from '../payment-methods/payment-methods.service';
import { EarningsService } from '../earnings/earnings.service';

@Controller('stripe-integration')
export class StripeIntegrationController {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly stripeIntegrationService: StripeIntegrationService,
    private readonly configService: ConfigService,
    private readonly paymentMethodsService: PaymentMethodsService,
    private readonly earningService: EarningsService,
  ) { }

  @Post('platform-webhook')
  async platformWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.configService.get('STRIPE_PLATFORM_WEBHOOK_SECRET'),
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException('Invalid webhook signature');
    }

    const eventDataObject = event.data.object;
    if (event.type === 'payment_method.attached') {
      await this.paymentMethodsService.savePaymentMethod(
        eventDataObject as Stripe.PaymentMethod,
      );
    } else if (event.type === 'payment_intent.succeeded') {
      await this.stripeIntegrationService.processPaymentIntentSuccess(
        event as Stripe.PaymentIntentSucceededEvent,
      );
    } else if (event.type === 'payment_intent.payment_failed') {
      await this.stripeIntegrationService.processPaymentIntentFailed(
        event as Stripe.PaymentIntentPaymentFailedEvent,
      );
    }

    return res.status(200).json({
      message: 'Webhook received successfully',
    });
  }

  @Post('connect-account-webhook')
  async paymentMethodWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        this.configService.get('STRIPE_CONNECT_ACCOUNT_WEBHOOK_SECRET'),
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      throw new BadRequestException('Invalid webhook signature');
    }

    const eventDataObject = event.data.object as Stripe.Account;
    if (
      event.type === 'account.updated' &&
      eventDataObject?.charges_enabled &&
      eventDataObject?.payouts_enabled &&
      eventDataObject?.details_submitted
    ) {
      await this.stripeIntegrationService.markUserConnectAccount(
        eventDataObject,
        ConnectAccountStatus.CONNECTED,
      );
    }

    if (
      event.type === 'account.updated' &&
      eventDataObject?.details_submitted &&
      (!eventDataObject?.payouts_enabled || !eventDataObject?.charges_enabled)
    ) {
      await this.stripeIntegrationService.markUserConnectAccount(
        eventDataObject,
        ConnectAccountStatus.UNDER_REVIEW,
      );
    }

    if (event.type === 'transfer.reversed') {
      await this.earningService.handleEarningsTransferFailed(event.data.object.metadata.transaction);
    }

    return res.status(200).json({
      message: 'Webhook received successfully',
    });
  }

  @Post()
  create(@Body() createStripeIntegrationDto: CreateStripeIntegrationDto) {
    return this.stripeIntegrationService.create(createStripeIntegrationDto);
  }

  @Get()
  findAll() {
    return this.stripeIntegrationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripeIntegrationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStripeIntegrationDto: UpdateStripeIntegrationDto,
  ) {
    return this.stripeIntegrationService.update(
      +id,
      updateStripeIntegrationDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripeIntegrationService.remove(+id);
  }
}
