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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const validation_exception_formatter_1 = require("../../utils/validation-exception-formatter");
const jwt_1 = require("@nestjs/jwt");
const login_attempt_service_1 = require("./login-attempt.service");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const otp_entity_1 = require("./entities/otp.entity");
const user_entity_1 = require("../users/entities/user.entity");
const dayjs = require("dayjs");
const notifications_service_1 = require("../notifications/notifications.service");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
let AuthService = class AuthService {
    constructor(usersRepository, otpRepository, stripe, jwtService, loginAttemptService, notificationsService, eventEmitter, configService) {
        this.usersRepository = usersRepository;
        this.otpRepository = otpRepository;
        this.stripe = stripe;
        this.jwtService = jwtService;
        this.loginAttemptService = loginAttemptService;
        this.notificationsService = notificationsService;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
    }
    async signUp(signUpDto, req) {
        const existingUser = await this.usersRepository.findOne({
            where: { email: signUpDto.email },
        });
        if (existingUser) {
            throw new validation_exception_formatter_1.ValidationException({ email: 'Email already exists' });
        }
        const user = this.usersRepository.create({
            ...signUpDto,
        });
        const stripeCustomer = await this.stripe.customers.create({
            email: signUpDto.email,
            name: `${signUpDto.first_name} ${signUpDto.last_name}`,
        });
        user.stripe_customer_id = stripeCustomer.id;
        await user.save();
        await this.notificationsService.createUserNotificationSetting(user);
        const accessToken = await this.jwtService.signAsync({
            user_id: user.id,
        });
        await this.loginAttemptService.createLoginAttempt(req, user, accessToken, login_attempt_entity_1.LoginType.EMAIL);
        const { password, ...userData } = user;
        return {
            user: userData,
            access_token: accessToken,
        };
    }
    async logIn(logInDto, req) {
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile_image', 'profile_image')
            .leftJoinAndSelect('user.banner_image', 'banner_image')
            .leftJoinAndSelect('user.country', 'country')
            .leftJoinAndSelect('user.company_type', 'company_type')
            .addSelect('user.password')
            .where('user.email = :email AND user.deleted_at IS NULL', {
            email: logInDto.email,
        })
            .andWhere('user.role In (:...roles)', { roles: logInDto.roles })
            .getOne();
        if (!user) {
            throw new common_1.NotFoundException('User does not exists');
        }
        if (user.status === user_entity_1.UserStatus.INACTIVE) {
            throw new common_1.BadRequestException('Your account has been deactivated by the admin');
        }
        if (!(await user.comparePassword(logInDto.password))) {
            throw new common_1.BadRequestException('Invalid Credentials');
        }
        const accessToken = await this.jwtService.signAsync({
            user_id: user.id,
        });
        await this.loginAttemptService.createLoginAttempt(req, user, accessToken, login_attempt_entity_1.LoginType.EMAIL);
        const { password, ...userData } = user;
        return { user: userData, access_token: accessToken };
    }
    async forgetPassword(forgetPasswordDto) {
        const user = await this.usersRepository.findOne({
            where: {
                email: forgetPasswordDto.email,
                status: user_entity_1.UserStatus.ACTIVE,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user) {
            throw new validation_exception_formatter_1.ValidationException({ email: "Email doesn't exists" });
        }
        const otp = this.otpRepository.create({
            purpose: otp_entity_1.OtpPurpose.FORGOT_PASSWORD,
            user: user,
            expires_at: dayjs().add(15, 'minutes').toDate(),
        });
        await this.otpRepository.save(otp);
        await this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [user.id],
            title: 'OTP For Password Reset',
            message: 'We received a request to reset your password. Use the OTP code shown below to reset it',
            template: email_template_enum_1.EmailTemplate.FORGET_PASSWORD_OTP,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: false,
            channels: [notification_entity_1.NotificationChannel.EMAIL],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.OTP,
            entity_id: otp.id,
            meta_data: {
                otp_code: otp.code,
                name: user.first_name + user.last_name,
                reset_url: `${this.configService.get('FRONTEND_URL')}/otp-verification?email=${user.email}`,
            },
        });
    }
    async verifyOtpCode(verifyOtpCodeDto) {
        const otp = await this.otpRepository.findOne({
            where: {
                code: verifyOtpCodeDto.otp_code,
                user: { email: verifyOtpCodeDto.email },
                is_used: false,
                expires_at: (0, typeorm_2.MoreThan)(new Date()),
                purpose: otp_entity_1.OtpPurpose.FORGOT_PASSWORD,
            },
        });
        if (!otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
    }
    async resetPassword(resetPasswordDto) {
        const otp = await this.otpRepository.findOne({
            where: {
                code: resetPasswordDto.otp_code,
                user: { email: resetPasswordDto.email },
                is_used: false,
                expires_at: (0, typeorm_2.MoreThan)(new Date()),
                purpose: otp_entity_1.OtpPurpose.FORGOT_PASSWORD,
            },
            relations: {
                user: true,
            },
        });
        if (!otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        otp.is_used = true;
        await this.otpRepository.save(otp);
        const user = otp.user;
        user.password = resetPasswordDto.password;
        await this.usersRepository.save(user);
    }
    async logout(currentLoginAttempt) {
        currentLoginAttempt.logout_at = new Date();
        await currentLoginAttempt.save();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(otp_entity_1.Otp)),
    __param(2, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_1.default,
        jwt_1.JwtService,
        login_attempt_service_1.LoginAttemptService,
        notifications_service_1.NotificationsService,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map