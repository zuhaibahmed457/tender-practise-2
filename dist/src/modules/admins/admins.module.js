"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const login_attempt_entity_1 = require("../auth/entities/login-attempt.entity");
const admins_service_1 = require("./admins.service");
const admins_controller_1 = require("./admins.controller");
const users_module_1 = require("../users/users.module");
const tender_module_1 = require("../tender/tender.module");
const bid_module_1 = require("../bid/bid.module");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const earning_entity_1 = require("../earnings/entities/earning.entity");
let AdminsModule = class AdminsModule {
};
exports.AdminsModule = AdminsModule;
exports.AdminsModule = AdminsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, login_attempt_entity_1.LoginAttempt, transaction_entity_1.Transaction, earning_entity_1.Earning]),
            users_module_1.UsersModule,
            tender_module_1.TenderModule,
            bid_module_1.BidModule,
        ],
        controllers: [admins_controller_1.AdminsController],
        providers: [admins_service_1.AdminsService],
    })
], AdminsModule);
//# sourceMappingURL=admins.module.js.map