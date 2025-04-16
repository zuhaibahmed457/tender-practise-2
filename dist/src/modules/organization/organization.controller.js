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
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_tenders_graph_dto_1 = require("../tender/dto/get-tenders-graph.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    async getDashboardStats(paramIdDto, currentUser) {
        const dashboardStats = await this.organizationService.getDashboardStats(paramIdDto, currentUser);
        return {
            message: 'Dashboard stats fetched successfully',
            details: dashboardStats,
        };
    }
    async getTenderGraphStates(currentUser, getTendersGraphDto) {
        const graphData = await this.organizationService.getTenderGraphStates(currentUser, getTendersGraphDto);
        return {
            message: 'Graph data fetched successfully',
            details: graphData,
        };
    }
};
exports.OrganizationController = OrganizationController;
__decorate([
    (0, common_1.Get)(':id/dashboard-stats'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('tender-graph'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_tenders_graph_dto_1.GetTendersGraphDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "getTenderGraphStates", null);
exports.OrganizationController = OrganizationController = __decorate([
    (0, common_1.Controller)('organization'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map