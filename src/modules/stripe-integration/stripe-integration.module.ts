import { Module } from '@nestjs/common';
import { StripeIntegrationService } from './stripe-integration.service';
import { StripeIntegrationController } from './stripe-integration.controller';
import { PaymentMethodsModule } from '../payment-methods/payment-methods.module';
import { EarningsModule } from '../earnings/earnings.module';

@Module({
  imports: [PaymentMethodsModule,EarningsModule],
  controllers: [StripeIntegrationController],
  providers: [StripeIntegrationService],
})
export class StripeIntegrationModule {}
