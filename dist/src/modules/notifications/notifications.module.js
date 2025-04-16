"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const notifications_controller_1 = require("./notifications.controller");
const typeorm_1 = require("@nestjs/typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const user_notification_entity_1 = require("./entities/user-notification.entity");
const user_notification_setting_entity_1 = require("./entities/user-notification-setting.entity");
const shared_module_1 = require("../../shared/shared.module");
const bullmq_1 = require("@nestjs/bullmq");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const path_1 = require("path");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const notification_consumer_1 = require("./consumers/notification.consumer");
const email_notification_service_1 = require("./services/email-notification.service");
const in_app_notification_service_1 = require("./services/in-app-notification.service");
const hbs = require("handlebars");
const push_notification_service_1 = require("./services/push-notification.service");
hbs.registerHelper('eq', function (arg1, arg2) {
    return arg1 === arg2;
});
let NotificationsModule = class NotificationsModule {
};
exports.NotificationsModule = NotificationsModule;
exports.NotificationsModule = NotificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                notification_entity_1.Notification,
                user_notification_entity_1.UserNotification,
                user_notification_setting_entity_1.UserNotificationSetting,
            ]),
            shared_module_1.SharedModule,
            mailer_1.MailerModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return {
                        transport: {
                            host: configService.get('EMAIL_HOST'),
                            secure: false,
                            auth: {
                                user: configService.get('EMAIL_USERNAME'),
                                pass: configService.get('EMAIL_PASSWORD'),
                            },
                        },
                        defaults: {
                            from: '"No Reply" <tender-word@example.com>',
                        },
                        template: {
                            dir: (0, path_1.join)(__dirname, 'templates'),
                            adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                            options: {
                                strict: true,
                            },
                        },
                    };
                },
            }),
            bullmq_1.BullModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get('REDIS_HOST'),
                        port: configService.get('REDIS_PORT'),
                    },
                    prefix: configService.get('NODE_ENV') === 'production'
                        ? 'tender-word-prod'
                        : 'tender-word-stag',
                }),
            }),
            bullmq_1.BullModule.registerQueue({
                name: 'notifications-queue',
                defaultJobOptions: {
                    attempts: 3,
                    backoff: {
                        type: 'exponential',
                        delay: 3000,
                    },
                    removeOnComplete: true,
                    removeOnFail: true,
                },
            }),
        ],
        controllers: [notifications_controller_1.NotificationsController],
        providers: [
            notifications_service_1.NotificationsService,
            notification_consumer_1.NotificationConsumer,
            email_notification_service_1.EmailNotificationService,
            in_app_notification_service_1.InAppNotificationService,
            push_notification_service_1.PushNotificationService,
        ],
        exports: [notifications_service_1.NotificationsService],
    })
], NotificationsModule);
//# sourceMappingURL=notifications.module.js.map