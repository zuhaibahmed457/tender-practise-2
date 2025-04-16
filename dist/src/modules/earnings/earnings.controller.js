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
exports.EarningsController = void 0;
const common_1 = require("@nestjs/common");
const earnings_service_1 = require("./earnings.service");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_all_earning_dto_1 = require("./dto/get-all-earning.dto");
let EarningsController = class EarningsController {
    constructor(earningsService) {
        this.earningsService = earningsService;
    }
    async findAll(getAllEarningDto, CurrentUser) {
        const { items, meta } = await this.earningsService.findAll(getAllEarningDto, CurrentUser);
        return {
            message: "All Earning fetch successfully",
            details: items,
            extra: meta
        };
    }
};
exports.EarningsController = EarningsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_earning_dto_1.GetAllEarningDto, user_entity_1.User]),
    __metadata("design:returntype", Promise)
], EarningsController.prototype, "findAll", null);
exports.EarningsController = EarningsController = __decorate([
    (0, common_1.Controller)('earnings'),
    __metadata("design:paramtypes", [earnings_service_1.EarningsService])
], EarningsController);
//# sourceMappingURL=earnings.controller.js.map