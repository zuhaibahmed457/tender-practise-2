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
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const notifications_service_1 = require("./notifications.service");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const user_entity_1 = require("../users/entities/user.entity");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
let NotificationsController = class NotificationsController {
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    async findAll(getAllDto, currentUser) {
        const { items, meta } = await this.notificationsService.findAll(getAllDto, currentUser);
        return {
            message: 'Notifications fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async unReadNotificationCount(currentUser) {
        const notificationCounts = await this.notificationsService.unReadNotificationCount(currentUser);
        return {
            message: 'Numbers of unread notifications fetched successfully',
            details: notificationCounts,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const userNotification = await this.notificationsService.findOne(paramIdDto, currentUser);
        return {
            message: 'Notification fetched successfully',
            details: userNotification,
        };
    }
    async readAllNotification(currentUser) {
        await this.notificationsService.readAllNotification(currentUser);
        return {
            message: 'All Notifications Read successfully',
        };
    }
    async readNotification(paramIdDto, currentUser) {
        const userNotification = await this.notificationsService.readNotification(paramIdDto, currentUser);
        return {
            message: 'Notification Read successfully',
            details: userNotification,
        };
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-notification-count'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "unReadNotificationCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('mark-all-as-read'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "readAllNotification", null);
__decorate([
    (0, common_1.Patch)('mark-as-read/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], NotificationsController.prototype, "readNotification", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map