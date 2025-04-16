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
exports.Notification = exports.NotificationChannel = exports.NotificationType = exports.NotificationEntityType = void 0;
const typeorm_1 = require("typeorm");
const user_notification_entity_1 = require("./user-notification.entity");
const email_template_enum_1 = require("../enums/email-template.enum");
var NotificationEntityType;
(function (NotificationEntityType) {
    NotificationEntityType["CERTIFICATE"] = "certificate";
    NotificationEntityType["SUBSCRIPTION"] = "subscription";
    NotificationEntityType["EMPLOYEE"] = "employee";
    NotificationEntityType["OTP"] = "otp";
    NotificationEntityType["TENDER"] = "tender";
    NotificationEntityType["ACCESS_REQUEST"] = "access_request";
    NotificationEntityType["BID"] = "bid";
    NotificationEntityType["CHAT"] = "chat";
    NotificationEntityType["MESSAGE"] = "message";
    NotificationEntityType["TRANSACTION"] = "transaction";
    NotificationEntityType["EARNING"] = "earning";
    NotificationEntityType["OTHER"] = "other";
})(NotificationEntityType || (exports.NotificationEntityType = NotificationEntityType = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["TRANSACTION"] = "transactional";
    NotificationType["NON_TRANSACTIONAL"] = "non_transactional";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["PUSH"] = "push";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
let Notification = class Notification extends typeorm_1.BaseEntity {
};
exports.Notification = Notification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.TRANSACTION,
    }),
    __metadata("design:type", String)
], Notification.prototype, "notification_type", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: email_template_enum_1.EmailTemplate,
        nullable: true,
    }),
    __metadata("design:type", String)
], Notification.prototype, "template", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'text',
        array: true,
        default: `{${NotificationChannel.EMAIL},${NotificationChannel.IN_APP},${NotificationChannel.PUSH}}`,
    }),
    __metadata("design:type", Array)
], Notification.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationEntityType,
        nullable: true,
    }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Notification.prototype, "entity_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], Notification.prototype, "entity_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_notification_entity_1.UserNotification, (userNotification) => userNotification.notification),
    __metadata("design:type", Array)
], Notification.prototype, "user_notifications", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notification')
], Notification);
//# sourceMappingURL=notification.entity.js.map