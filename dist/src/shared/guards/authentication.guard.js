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
exports.AuthenticationGuard = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const dayjs = require("dayjs");
const user_entity_1 = require("../../modules/users/entities/user.entity");
const login_attempt_entity_1 = require("../../modules/auth/entities/login-attempt.entity");
let AuthenticationGuard = class AuthenticationGuard {
    constructor(loginAttemptsRepository, usersRepository) {
        this.loginAttemptsRepository = loginAttemptsRepository;
        this.usersRepository = usersRepository;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const accessToken = this.extractTokenFromHeader(request);
        if (!accessToken) {
            throw new common_1.UnauthorizedException('Please provide access token');
        }
        const loginAttempt = await this.loginAttemptsRepository.findOne({
            where: {
                access_token: accessToken,
                logout_at: (0, typeorm_2.IsNull)(),
                expire_at: (0, typeorm_2.MoreThan)(new Date()),
            },
            relations: {
                user: true,
            },
        });
        if (!loginAttempt) {
            throw new common_1.UnauthorizedException('Please login again');
        }
        const user = await this.usersRepository.findOne({
            where: {
                id: loginAttempt.user.id,
                deleted_at: (0, typeorm_2.IsNull)(),
                status: user_entity_1.UserStatus.ACTIVE,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Session expired');
        }
        loginAttempt.expire_at = dayjs().add(1, 'month').toDate();
        await this.loginAttemptsRepository.save(loginAttempt);
        request['user'] = user;
        request['loginAttempt'] = loginAttempt;
        return true;
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthenticationGuard = AuthenticationGuard;
exports.AuthenticationGuard = AuthenticationGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], AuthenticationGuard);
//# sourceMappingURL=authentication.guard.js.map