"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var NotificationConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const common_1 = require("@nestjs/common");
const email_notification_service_1 = require("../services/email-notification.service");
const in_app_notification_service_1 = require("../services/in-app-notification.service");
const notification_entity_1 = require("../entities/notification.entity");
const user_notification_entity_1 = require("../entities/user-notification.entity");
const user_notification_setting_entity_1 = require("../entities/user-notification-setting.entity");
const push_notification_service_1 = require("../services/push-notification.service");
const MAX_RETRIES = 3;
let NotificationConsumer = NotificationConsumer_1 = class NotificationConsumer extends bullmq_1.WorkerHost {
    constructor(emailNotificationService, inAppNotificationService, pushNotificationService, userNotificationRepository, userNotificationSettingRepository) {
        super();
        this.emailNotificationService = emailNotificationService;
        this.inAppNotificationService = inAppNotificationService;
        this.pushNotificationService = pushNotificationService;
        this.userNotificationRepository = userNotificationRepository;
        this.userNotificationSettingRepository = userNotificationSettingRepository;
        this.logger = new common_1.Logger(NotificationConsumer_1.name);
    }
    async process(job) {
        console.log(`🚀 Processing job: ${job.id} (Attempt ${job.attemptsMade + 1})`);
        try {
            const { user_notification_id, meta_data } = job.data;
            const userNotification = await this.getUserNotification(user_notification_id);
            if (!userNotification) {
                return;
            }
            const allowedChannels = await this.getAllowedChannels(userNotification);
            await this.sendNotifications(allowedChannels, userNotification, meta_data);
            console.log(`✅ Job ${job.id} processed successfully`);
        }
        catch (error) {
            await this.handleJobError(job, error);
        }
    }
    async getUserNotification(userNotificationId) {
        const userNotification = await this.userNotificationRepository.findOne({
            where: { id: userNotificationId },
            relations: { notification: true, user: true },
        });
        if (!userNotification) {
            this.logger.warn(`⚠️ UserNotification not found: ${userNotificationId}`);
            return null;
        }
        return userNotification;
    }
    async getAllowedChannels(userNotification) {
        const { notification, user, bypass_user_preferences } = userNotification;
        if (bypass_user_preferences) {
            return notification.channels;
        }
        const userSettings = await this.userNotificationSettingRepository.findOne({
            where: { user: { id: user.id } },
        });
        return notification.channels.filter((channel) => this.isChannelEnabled(channel, userSettings));
    }
    isChannelEnabled(channel, settings) {
        switch (channel) {
            case notification_entity_1.NotificationChannel.EMAIL:
                return settings?.is_email_enabled ?? false;
            case notification_entity_1.NotificationChannel.IN_APP:
                return settings?.is_in_app_enabled ?? false;
            case notification_entity_1.NotificationChannel.PUSH:
                return settings?.is_push_enabled ?? false;
            default:
                return false;
        }
    }
    async sendNotifications(channels, userNotification, payload) {
        const tasks = [];
        if (channels.includes(notification_entity_1.NotificationChannel.EMAIL)) {
            tasks.push(this.emailNotificationService.sendNotification(userNotification, payload));
        }
        if (channels.includes(notification_entity_1.NotificationChannel.IN_APP)) {
            tasks.push(this.inAppNotificationService.sendNotification(userNotification, payload));
        }
        if (channels.includes(notification_entity_1.NotificationChannel.PUSH)) {
            tasks.push(this.pushNotificationService.sendNotification(userNotification, payload));
        }
        try {
            await Promise.all(tasks);
            userNotification.status = user_notification_entity_1.UserNotificationStatus.SENT;
        }
        catch (err) {
            userNotification.status = user_notification_entity_1.UserNotificationStatus.FAILED;
            console.log(err);
        }
        finally {
            await userNotification.save();
        }
    }
    async handleJobError(job, error) {
        if (job.attemptsMade < MAX_RETRIES) {
            this.logger.warn(`🔄 Job failed. Retrying in some time (Attempt ${job.attemptsMade + 1}/${MAX_RETRIES})`);
            await job.retry();
        }
        else {
            await job.moveToFailed(error, job.token);
        }
    }
    async onJobFailed(job, error) {
        this.logger.error(`🔥 Job permanently failed.`, error.stack);
    }
};
exports.NotificationConsumer = NotificationConsumer;
__decorate([
    (0, bullmq_1.OnWorkerEvent)('failed'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bullmq_2.Job, Error]),
    __metadata("design:returntype", Promise)
], NotificationConsumer.prototype, "onJobFailed", null);
exports.NotificationConsumer = NotificationConsumer = NotificationConsumer_1 = __decorate([
    (0, bullmq_1.Processor)('notifications-queue'),
    __param(3, (0, typeorm_1.InjectRepository)(user_notification_entity_1.UserNotification)),
    __param(4, (0, typeorm_1.InjectRepository)(user_notification_setting_entity_1.UserNotificationSetting)),
    __metadata("design:paramtypes", [email_notification_service_1.EmailNotificationService,
        in_app_notification_service_1.InAppNotificationService,
        push_notification_service_1.PushNotificationService,
        typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationConsumer);
//# sourceMappingURL=notification.consumer.js.map