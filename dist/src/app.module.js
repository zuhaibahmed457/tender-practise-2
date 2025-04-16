"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const schedule_1 = require("@nestjs/schedule");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const to_boolean_1 = require("./utils/to-boolean");
const nestjs_form_data_1 = require("nestjs-form-data");
const users_module_1 = require("./modules/users/users.module");
const shared_module_1 = require("./shared/shared.module");
const logger_module_1 = require("./modules/logger/logger.module");
const auth_module_1 = require("./modules/auth/auth.module");
const core_1 = require("@nestjs/core");
const all_exceptions_filter_1 = require("./shared/allExceptionFilter/all-exceptions.filter");
const all_response_interceptor_1 = require("./shared/interceptors/all-response.interceptor");
const admins_module_1 = require("./modules/admins/admins.module");
const country_module_1 = require("./modules/country/country.module");
const tender_module_1 = require("./modules/tender/tender.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const event_emitter_1 = require("@nestjs/event-emitter");
const industry_module_1 = require("./modules/industry/industry.module");
const company_type_module_1 = require("./modules/company-type/company-type.module");
const sizes_module_1 = require("./modules/sizes/sizes.module");
const media_module_1 = require("./modules/media/media.module");
const address_module_1 = require("./modules/address/address.module");
const bid_module_1 = require("./modules/bid/bid.module");
const payment_methods_module_1 = require("./modules/payment-methods/payment-methods.module");
const stripe_integration_module_1 = require("./modules/stripe-integration/stripe-integration.module");
const chat_module_1 = require("./modules/chat/chat.module");
const platform_fees_module_1 = require("./modules/platform-fees/platform-fees.module");
const review_rating_module_1 = require("./modules/review-rating/review-rating.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const earnings_module_1 = require("./modules/earnings/earnings.module");
const organization_module_1 = require("./modules/organization/organization.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            country_module_1.CountryModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 1 * 60 * 1000,
                    limit: 100,
                },
            ]),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: `.env.${process.env.NODE_ENV}`,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return {
                        type: 'postgres',
                        host: configService.get('DB_HOST'),
                        port: configService.get('DB_PORT'),
                        username: configService.get('DB_USERNAME'),
                        password: configService.get('DB_PASSWORD'),
                        database: configService.get('DB_DATABASE'),
                        autoLoadEntities: true,
                        synchronize: (0, to_boolean_1.valueToBoolean)(configService.get('DB_SYNCHRONIZE')),
                        ...(configService.get('NODE_ENV') !== 'development' && {
                            ssl: {
                                rejectUnauthorized: false,
                            },
                        }),
                    };
                },
            }),
            nestjs_form_data_1.NestjsFormDataModule.config({
                isGlobal: true,
                storage: nestjs_form_data_1.MemoryStoredFile,
            }),
            users_module_1.UsersModule,
            shared_module_1.SharedModule,
            logger_module_1.LoggerModule,
            auth_module_1.AuthModule,
            admins_module_1.AdminsModule,
            tender_module_1.TenderModule,
            notifications_module_1.NotificationsModule,
            industry_module_1.IndustryModule,
            company_type_module_1.CompanyTypeModule,
            sizes_module_1.SizesModule,
            media_module_1.MediaModule,
            address_module_1.AddressModule,
            bid_module_1.BidModule,
            payment_methods_module_1.PaymentMethodsModule,
            stripe_integration_module_1.StripeIntegrationModule,
            chat_module_1.ChatModule,
            platform_fees_module_1.PlatformFeesModule,
            review_rating_module_1.ReviewRatingModule,
            transactions_module_1.TransactionsModule,
            earnings_module_1.EarningsModule,
            organization_module_1.OrganizationModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: all_response_interceptor_1.AllResponseInterceptor,
            },
            app_service_1.AppService,
            app_service_1.AppService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map