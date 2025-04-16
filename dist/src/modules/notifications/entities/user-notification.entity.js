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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotification = exports.UserNotificationStatus = void 0;
const typeorm_1 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var UserNotificationStatus;
(function (UserNotificationStatus) {
    UserNotificationStatus["PENDING"] = "pending";
    UserNotificationStatus["SENT"] = "sent";
    UserNotificationStatus["FAILED"] = "failed";
})(UserNotificationStatus || (exports.UserNotificationStatus = UserNotificationStatus = {}));
let UserNotification = class UserNotification extends typeorm_1.BaseEntity {
};
exports.UserNotification = UserNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => notification_entity_1.Notification, (notification) => notification.user_notifications, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'notification_id' }),
    __metadata("design:type", notification_entity_1.Notification)
], UserNotification.prototype, "notification", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserNotification.prototype, "is_displayable", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserNotification.prototype, "bypass_user_preferences", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.user_notifications, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", user_entity_1.User)
], UserNotification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserNotificationStatus,
        default: UserNotificationStatus.PENDING,
    }),
    __metadata("design:type", String)
], UserNotification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], UserNotification.prototype, "is_read", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], UserNotification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], UserNotification.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], UserNotification.prototype, "deleted_at", void 0);
exports.UserNotification = UserNotification = __decorate([
    (0, typeorm_1.Entity)('user_notification')
], UserNotification);
//# sourceMappingURL=user-notification.entity.js.map