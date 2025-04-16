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
exports.LoginAttemptService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const login_attempt_entity_1 = require("./entities/login-attempt.entity");
const ua_parser_js_1 = require("ua-parser-js");
const request_ip_1 = require("request-ip");
const dayjs = require("dayjs");
let LoginAttemptService = class LoginAttemptService {
    constructor(loginAttemptsRepository) {
        this.loginAttemptsRepository = loginAttemptsRepository;
    }
    async createLoginAttempt(req, user, accessToken, loginType) {
        const parser = new ua_parser_js_1.UAParser();
        const userAgentInfo = parser.setUA(req.headers['user-agent']).getResult();
        const loginAttempt = this.loginAttemptsRepository.create({
            user: user,
            access_token: accessToken,
            ip_address: (0, request_ip_1.getClientIp)(req),
            platform: userAgentInfo?.os?.name,
            user_agent: req?.headers['user-agent'],
            expire_at: dayjs().add(1, 'month').toDate(),
            login_type: loginType,
        });
        return loginAttempt.save();
    }
};
exports.LoginAttemptService = LoginAttemptService;
exports.LoginAttemptService = LoginAttemptService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], LoginAttemptService);
//# sourceMappingURL=login-attempt.service.js.map