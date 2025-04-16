"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const transaction_manager_service_1 = require("./services/transaction-manager.service");
const typeorm_1 = require("@nestjs/typeorm");
const url_service_1 = require("./services/url.service");
const user_entity_1 = require("../modules/users/entities/user.entity");
const stripe_1 = require("stripe");
const login_attempt_entity_1 = require("../modules/auth/entities/login-attempt.entity");
const real_time_gateway_1 = require("./gateway/real-time.gateway");
const s3_service_1 = require("./services/s3.service");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([login_attempt_entity_1.LoginAttempt, user_entity_1.User]),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    global: true,
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRES_IN'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
        ],
        controllers: [],
        providers: [
            transaction_manager_service_1.TransactionManagerService,
            s3_service_1.S3Service,
            real_time_gateway_1.RealTimeGateway,
            url_service_1.UrlService,
            {
                provide: 'STRIPE_CLIENT',
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    return new stripe_1.default(configService.get('STRIPE_SECRET_KEY'), {
                        apiVersion: '2025-01-27.acacia',
                    });
                },
            },
        ],
        exports: [
            jwt_1.JwtModule,
            transaction_manager_service_1.TransactionManagerService,
            url_service_1.UrlService,
            typeorm_1.TypeOrmModule,
            real_time_gateway_1.RealTimeGateway,
            s3_service_1.S3Service,
            'STRIPE_CLIENT',
        ],
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map