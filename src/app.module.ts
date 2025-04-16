import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { valueToBoolean } from './utils/to-boolean';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/shared.module';
import { LoggerModule } from './modules/logger/logger.module';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './shared/allExceptionFilter/all-exceptions.filter';
import { AllResponseInterceptor } from './shared/interceptors/all-response.interceptor';
import { AdminsModule } from './modules/admins/admins.module';
import { CountryModule } from './modules/country/country.module';
import { TenderModule } from './modules/tender/tender.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { IndustryModule } from './modules/industry/industry.module';
import { CompanyTypeModule } from './modules/company-type/company-type.module';
import { SizesModule } from './modules/sizes/sizes.module';
import { MediaModule } from './modules/media/media.module';
import { AddressModule } from './modules/address/address.module';
import { BidModule } from './modules/bid/bid.module';
import { PaymentMethodsModule } from './modules/payment-methods/payment-methods.module';
import { StripeIntegrationModule } from './modules/stripe-integration/stripe-integration.module';
import { ChatModule } from './modules/chat/chat.module';
import { PlatformFeesModule } from './modules/platform-fees/platform-fees.module';
import { ReviewRatingModule } from './modules/review-rating/review-rating.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { EarningsModule } from './modules/earnings/earnings.module';
import { OrganizationModule } from './modules/organization/organization.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CountryModule,
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 1 * 60 * 1000, // ** 1 min
        limit: 100, // allowed per ttl
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: valueToBoolean(configService.get('DB_SYNCHRONIZE')),
          ...(configService.get('NODE_ENV') !== 'development' && {
            ssl: {
              rejectUnauthorized: false,
            },
          }),
        };
      },
    }),
    NestjsFormDataModule.config({
      isGlobal: true,
      storage: MemoryStoredFile,
    }),
    UsersModule,
    SharedModule,
    LoggerModule,
    AuthModule,
    AdminsModule,
    TenderModule,
    NotificationsModule,
    IndustryModule,
    CompanyTypeModule,
    SizesModule,
    MediaModule,
    AddressModule,
    BidModule,
    PaymentMethodsModule,
    StripeIntegrationModule,
    ChatModule,
    PlatformFeesModule,
    ReviewRatingModule,
    TransactionsModule,
    EarningsModule,
    OrganizationModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AllResponseInterceptor,
    },
    AppService,
    AppService,
  ],
})
export class AppModule {}
