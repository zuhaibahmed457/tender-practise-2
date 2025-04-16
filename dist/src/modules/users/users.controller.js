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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const update_user_dto_1 = require("./dto/update-user.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const user_entity_1 = require("./entities/user.entity");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const get_all_user_dto_1 = require("./dto/get-all-user-dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const manage_status_dto_1 = require("./dto/manage-status-dto");
const text_capitalize_1 = require("../../utils/text-capitalize");
const current_login_attempt_decorator_1 = require("../../shared/decorators/current-login-attempt.decorator");
const add_device_token_dto_1 = require("./dto/add-device-token.dto");
const login_attempt_entity_1 = require("../auth/entities/login-attempt.entity");
const create_user_dto_1 = require("./dto/create-user.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
const change_password_dto_1 = require("./dto/change-password.dto");
const update_time_zone_dto_1 = require("./dto/update-time-zone.dto");
const upload_profile_dto_1 = require("./dto/upload-profile.dto");
const create_connect_account_link_dto_1 = require("./dto/create-connect-account-link.dto");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async create(createUserDto, currentUser) {
        const user = await this.usersService.create(createUserDto, currentUser);
        return {
            message: 'User created successfully',
            details: user,
        };
    }
    async createConnectAccountLink(createConnectAccountLink, currentUser) {
        const link = await this.usersService.createConnectAccountLink(currentUser, createConnectAccountLink);
        return {
            message: 'Redirecting to stripe connect',
            details: link,
        };
    }
    async uploadProfile(uploadProfileDto, currentUser) {
        const user = await this.usersService.uploadProfile(uploadProfileDto, currentUser);
        return {
            message: 'Profile picture uploaded successfully',
            details: user,
        };
    }
    async updateTimeZone(currentUser, updateTimeZoneDto) {
        await this.usersService.updateTimeZone(currentUser, updateTimeZoneDto);
        return {
            message: 'Timezone updated succesfully',
        };
    }
    async changePassword(currentUser, changePasswordDto) {
        await this.usersService.changePassword(currentUser, changePasswordDto);
        return {
            message: 'Password changed successfully',
        };
    }
    async findAll(getAllDto, user) {
        const { items, meta } = await this.usersService.findAll(user, getAllDto);
        return {
            message: 'Users fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramDto, currentUser) {
        const user = await this.usersService.findOne(paramDto, currentUser);
        return {
            message: 'User fetched successfully',
            details: user,
        };
    }
    async update(paramDto, updateUserDto, user) {
        const updatedUser = await this.usersService.update(paramDto, updateUserDto, user);
        return {
            message: `Profile updated successfully`,
            details: updatedUser,
        };
    }
    async manage_status(paramDto, manageStatusDto, user) {
        const updatedUser = await this.usersService.manageStatus(paramDto, manageStatusDto, user);
        return {
            message: `${(0, text_capitalize_1.textCapitalize)(manageStatusDto.status)} successfully`,
            details: updatedUser,
        };
    }
    remove(currentUser) {
        return this.usersService.remove(currentUser);
    }
    async addDeviceToken(currentLoginAttempt, addDeviceTokenDto) {
        await this.usersService.addDeviceToken(currentLoginAttempt, addDeviceTokenDto);
        return {
            message: 'Device token saved successfully',
        };
    }
    async attachIndustryToUser(userId, industryId, currentUser) {
        const preference = await this.usersService.attachIndustryToUser(currentUser, userId, industryId);
        return {
            message: 'Industry added to your preference',
            details: preference,
        };
    }
    async deleteIndustryFromUser(userId, industryId, currentUser) {
        await this.usersService.deleteIndustryFromUser(currentUser, userId, industryId);
        return {
            message: 'Industry deleted from your preference',
        };
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('create-connect-account-link'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_connect_account_link_dto_1.CreateConnectAccountLink,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createConnectAccountLink", null);
__decorate([
    (0, common_1.Post)('upload/profile-picture'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [upload_profile_dto_1.UploadProfileDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfile", null);
__decorate([
    (0, common_1.Patch)('update/timezone'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        update_time_zone_dto_1.UpdateTimeZoneDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateTimeZone", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_user_dto_1.GetAllUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)('update/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_user_dto_1.UpdateUserDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('manage-status/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        manage_status_dto_1.ManageStatusDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "manage_status", null);
__decorate([
    (0, common_1.Delete)('delete'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-device-token'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_login_attempt_decorator_1.CurrentLoginAttempt)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_attempt_entity_1.LoginAttempt,
        add_device_token_dto_1.AddDeviceTokenDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addDeviceToken", null);
__decorate([
    (0, common_1.Post)(':user_id/industry/:industry_id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('industry_id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "attachIndustryToUser", null);
__decorate([
    (0, common_1.Delete)(':user_id/industry/:industry_id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)('user_id')),
    __param(1, (0, common_1.Param)('industry_id')),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteIndustryFromUser", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map