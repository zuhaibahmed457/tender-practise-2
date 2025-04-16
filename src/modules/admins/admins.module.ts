import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { UsersModule } from '../users/users.module';
import { TenderModule } from '../tender/tender.module';
import { BidModule } from '../bid/bid.module';
import { Transaction } from '../transactions/entities/transaction.entity';
import { Earning } from '../earnings/entities/earning.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, LoginAttempt, Transaction, Earning]),
    UsersModule,
    TenderModule,
    BidModule,
  ],
  controllers: [AdminsController],
  providers: [AdminsService],
})
export class AdminsModule {}
