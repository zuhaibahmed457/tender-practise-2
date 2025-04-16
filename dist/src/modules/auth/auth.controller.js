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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const sign_up_dto_1 = require("./dto/sign-up.dto");
const log_in_dto_1 = require("./dto/log-in.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const forget_password_dto_1 = require("./dto/forget-password.dto");
const throttler_1 = require("@nestjs/throttler");
const reset_password_dto_1 = require("./dto/reset-password.dto");
const current_login_attempt_decorator_1 = require("../../shared/decorators/current-login-attempt.decorator");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_form_data_1 = require("nestjs-form-data");
const verify_otp_code_dto_1 = require("./dto/verify-otp-code.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(signUpDto, req) {
        const signUpResponse = await this.authService.signUp(signUpDto, req);
        return {
            message: 'Account created successfully',
            details: signUpResponse.user,
            extra: { access_token: signUpResponse.access_token },
        };
    }
    async logIn(logInDto, req) {
        const signInResponse = await this.authService.logIn(logInDto, req);
        return {
            message: 'Login successfully',
            details: signInResponse.user,
            extra: { access_token: signInResponse.access_token },
        };
    }
    async findMe(currentUser) {
        return {
            message: 'User authenticated successfully',
            details: currentUser,
        };
    }
    async forgetPassword(forgetPasswordDto) {
        await this.authService.forgetPassword(forgetPasswordDto);
        return {
            message: 'OTP sent successfully, please check you email',
        };
    }
    async verifyOtpCode(verifyOtpCodeDto) {
        await this.authService.verifyOtpCode(verifyOtpCodeDto);
        return {
            message: 'Otp code is correct',
        };
    }
    async resetPassword(resetPasswordDto) {
        await this.authService.resetPassword(resetPasswordDto);
        return {
            message: 'Password reset successfully, Please login',
        };
    }
    async logout(currentLoginAttempt) {
        await this.authService.logout(currentLoginAttempt);
        return {
            message: 'Logged out successfully',
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('sign-up'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [sign_up_dto_1.SignUpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [log_in_dto_1.LogInDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logIn", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "findMe", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { ttl: 2 * 60 * 1000, limit: 1 } }),
    (0, common_1.Post)('forget-password'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { ttl: 2 * 60 * 1000, limit: 3 } }),
    (0, common_1.Post)('verify-otp'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_otp_code_dto_1.VerifyOtpCodeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtpCode", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, throttler_1.Throttle)({ default: { ttl: 1 * 60 * 1000, limit: 3 } }),
    (0, common_1.Post)('reset-password'),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.HttpCode)(200),
    (0, common_1.Post)('logout'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_login_attempt_decorator_1.CurrentLoginAttempt)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_attempt_entity_1.LoginAttempt]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map