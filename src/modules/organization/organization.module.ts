import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { EarningsModule } from '../earnings/earnings.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BidModule } from '../bid/bid.module';
import { TenderModule } from '../tender/tender.module';

@Module({
  imports: [EarningsModule, TransactionsModule, BidModule,TenderModule],
  controllers: [OrganizationController],
  providers: [OrganizationService],
})
export class OrganizationModule {}
