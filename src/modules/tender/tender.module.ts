import { Module } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderController } from './tender.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from '../media/entities/media.entity';
import { Tender } from './entities/tender.entity';
import { Address } from '../address/entities/address.entity';
import { Industry } from '../industry/entities/industry.entity';
import { Size } from '../sizes/entities/size.entity';
import { MediaModule } from '../media/media.module';
import { Bid } from '../bid/entities/bid.entity';
import { EarningsModule } from '../earnings/earnings.module';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Earning } from '../earnings/entities/earning.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tender,
      Media,
      Address,
      Industry,
      Size,
      Bid,
      Transaction,
      Earning,
    ]),
    MediaModule,
    EarningsModule,
  ],
  controllers: [TenderController],
  providers: [TenderService],
  exports: [TenderService],
})
export class TenderModule {}
