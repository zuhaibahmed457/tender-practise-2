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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_notification_entity_1 = require("./entities/user-notification.entity");
const user_notification_setting_entity_1 = require("./entities/user-notification-setting.entity");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./entities/notification.entity");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const event_emitter_1 = require("@nestjs/event-emitter");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let NotificationsService = class NotificationsService {
    constructor(userNotificationSettingRepository, userNotificationRepository, notificationRepository, transactionalNotificationQueue) {
        this.userNotificationSettingRepository = userNotificationSettingRepository;
        this.userNotificationRepository = userNotificationRepository;
        this.notificationRepository = notificationRepository;
        this.transactionalNotificationQueue = transactionalNotificationQueue;
    }
    async findAll(getAllDto, currentUser) {
        const { page, per_page } = getAllDto;
        const query = this.userNotificationRepository
            .createQueryBuilder('notifications')
            .leftJoinAndSelect('notifications.notification', 'notify')
            .leftJoinAndSelect('notifications.user', 'user')
            .where('user.id = :user_id AND notifications.is_displayable = true AND notifications.deleted_at IS NULL', { user_id: currentUser.id })
            .orderBy('notifications.created_at', 'DESC');
        const paginationOptions = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async unReadNotificationCount(currentUser) {
        const unReadUserNotificationsCount = await this.userNotificationRepository.count({
            where: {
                is_displayable: true,
                is_read: false,
                deleted_at: (0, typeorm_2.IsNull)(),
                user: {
                    id: currentUser?.id,
                },
            },
        });
        return { total_unread_notifications: unReadUserNotificationsCount };
    }
    async findOne({ id }, currentUser) {
        const userNotification = await this.userNotificationRepository.findOne({
            where: {
                id,
                is_displayable: true,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
            relations: {
                notification: true,
                user: true,
            },
        });
        if (!userNotification)
            throw new common_1.NotFoundException('Notification not found');
        if (userNotification?.user?.id !== currentUser?.id) {
            throw new common_1.ForbiddenException('you are not authorized to view this notification');
        }
        return userNotification;
    }
    async readAllNotification(currentUser) {
        const userNotification = await this.userNotificationRepository.find({
            where: {
                is_displayable: true,
                is_read: false,
                deleted_at: (0, typeorm_2.IsNull)(),
                user: {
                    id: currentUser?.id,
                },
            },
        });
        if (!userNotification.length)
            throw new common_1.NotFoundException('No unread notifications');
        await this.userNotificationRepository.update({
            user: { id: currentUser?.id },
            is_displayable: true,
            is_read: false,
            deleted_at: (0, typeorm_2.IsNull)(),
        }, { is_read: true });
        return;
    }
    async readNotification(paramIdDto, currentUser) {
        const userNotification = await this.findOne(paramIdDto, currentUser);
        userNotification.is_read = true;
        return await userNotification.save();
    }
    async createUserNotificationSetting(currentUser) {
        const userNotificationSetting = this.userNotificationSettingRepository.create({
            user: currentUser,
        });
        return userNotificationSetting.save();
    }
    async createSendNotification(notificationPayload) {
        const { user_ids, title, message, template, is_displayable, channels, entity_type, entity_id, meta_data, bypass_user_preferences, notification_type, } = notificationPayload;
        const notification = this.notificationRepository.create({
            title,
            message,
            notification_type,
            template,
            entity_type,
            entity_id,
            channels,
        });
        await notification.save();
        for (const user_id of user_ids) {
            console.log("notification created for ", user_id);
            const userNotification = await this.userNotificationRepository.save({
                user: {
                    id: user_id,
                },
                notification,
                status: user_notification_entity_1.UserNotificationStatus.PENDING,
                is_displayable,
                bypass_user_preferences,
            });
            await this.transactionalNotificationQueue.add('send_notification', {
                user_notification_id: userNotification.id,
                meta_data,
            }, {
                priority: notification.notification_type === notification_entity_1.NotificationType.TRANSACTION
                    ? 1
                    : 10,
            });
        }
    }
};
exports.NotificationsService = NotificationsService;
__decorate([
    (0, event_emitter_1.OnEvent)('create-send-notification'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsService.prototype, "createSendNotification", null);
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_notification_setting_entity_1.UserNotificationSetting)),
    __param(1, (0, typeorm_1.InjectRepository)(user_notification_entity_1.UserNotification)),
    __param(2, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(3, (0, bullmq_1.InjectQueue)('notifications-queue')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        bullmq_2.Queue])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map