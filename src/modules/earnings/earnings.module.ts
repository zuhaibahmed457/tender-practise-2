import { Module } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { EarningsController } from './earnings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Earning } from './entities/earning.entity';
import { Transaction } from '../transactions/entities/transaction.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Earning,Transaction])],
  controllers: [EarningsController],
  providers: [EarningsService],
  exports:[EarningsService]
})
export class EarningsModule {}
