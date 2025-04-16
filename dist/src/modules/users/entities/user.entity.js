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
exports.User = exports.ConnectAccountStatus = exports.UserPaymentMethodStatus = exports.UserStatus = exports.UserRole = void 0;
const login_attempt_entity_1 = require("../../auth/entities/login-attempt.entity");
const typeorm_1 = require("typeorm");
const bcrypt = require("bcryptjs");
const otp_entity_1 = require("../../auth/entities/otp.entity");
const user_notification_setting_entity_1 = require("../../notifications/entities/user-notification-setting.entity");
const user_notification_entity_1 = require("../../notifications/entities/user-notification.entity");
const country_entity_1 = require("../../country/entities/country.entity");
const company_type_entity_1 = require("../../company-type/entities/company-type.entity");
const user_industries_entity_1 = require("./user-industries.entity");
const media_entity_1 = require("../../media/entities/media.entity");
const review_rating_entity_1 = require("../../review-rating/entities/review-rating.entity");
var UserRole;
(function (UserRole) {
    UserRole["SUPER_ADMIN"] = "super_admin";
    UserRole["ADMIN"] = "admin";
    UserRole["ORGANIZATION"] = "organization";
    UserRole["TRANSPORTER"] = "transporter";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
var UserPaymentMethodStatus;
(function (UserPaymentMethodStatus) {
    UserPaymentMethodStatus["NOT_PROVIDED"] = "not_provided";
    UserPaymentMethodStatus["PROVIDED"] = "provided";
})(UserPaymentMethodStatus || (exports.UserPaymentMethodStatus = UserPaymentMethodStatus = {}));
var ConnectAccountStatus;
(function (ConnectAccountStatus) {
    ConnectAccountStatus["NOT_CONNECTED"] = "not_connected";
    ConnectAccountStatus["UNDER_REVIEW"] = "under_review";
    ConnectAccountStatus["CONNECTED"] = "connected";
})(ConnectAccountStatus || (exports.ConnectAccountStatus = ConnectAccountStatus = {}));
let User = class User extends typeorm_1.BaseEntity {
    async hashPassword() {
        if (this.password) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(this.password, salt);
        }
    }
    async comparePassword(receivedPassword) {
        return bcrypt.compare(receivedPassword, this.password);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.Media, { onDelete: 'SET NULL', nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'profile_image_id' }),
    __metadata("design:type", media_entity_1.Media)
], User.prototype, "profile_image", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.Media, { onDelete: 'SET NULL', nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'banner_image_id' }),
    __metadata("design:type", media_entity_1.Media)
], User.prototype, "banner_image", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "first_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "last_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "phone_no", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ select: false, nullable: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stripe_customer_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "stripe_connect_account_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ConnectAccountStatus,
        default: ConnectAccountStatus.NOT_CONNECTED,
    }),
    __metadata("design:type", String)
], User.prototype, "connect_account_status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: UserPaymentMethodStatus,
        default: UserPaymentMethodStatus.NOT_PROVIDED,
    }),
    __metadata("design:type", String)
], User.prototype, "payment_method_status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "time_zone", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => country_entity_1.Country, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'country_id' }),
    __metadata("design:type", country_entity_1.Country)
], User.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => company_type_entity_1.CompanyType, {
        onDelete: 'SET NULL',
        eager: true,
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'company_type_id' }),
    __metadata("design:type", company_type_entity_1.CompanyType)
], User.prototype, "company_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 2, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "average_rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "no_of_ratings", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deleted_at", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => login_attempt_entity_1.LoginAttempt, (loginAttempt) => loginAttempt.user),
    __metadata("design:type", Array)
], User.prototype, "login_attempts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => otp_entity_1.Otp, (otp) => otp.user),
    __metadata("design:type", Array)
], User.prototype, "otps", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_notification_setting_entity_1.UserNotificationSetting, (userNotificationSetting) => userNotificationSetting.user),
    __metadata("design:type", user_notification_setting_entity_1.UserNotificationSetting)
], User.prototype, "user_notification_setting", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_notification_entity_1.UserNotification, (userNotification) => userNotification.user),
    __metadata("design:type", Array)
], User.prototype, "user_notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_industries_entity_1.UserIndustries, (userIndustries) => userIndustries.user),
    __metadata("design:type", Array)
], User.prototype, "user_industries", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_rating_entity_1.ReviewRating, (rating) => rating.given_by),
    __metadata("design:type", Array)
], User.prototype, "given_ratings", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_rating_entity_1.ReviewRating, (rating) => rating.given_to),
    __metadata("design:type", Array)
], User.prototype, "received_ratings", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    (0, typeorm_1.BeforeUpdate)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], User.prototype, "hashPassword", null);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map