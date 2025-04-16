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
exports.BidController = void 0;
const common_1 = require("@nestjs/common");
const bid_service_1 = require("./bid.service");
const create_bid_dto_1 = require("./dto/create-bid.dto");
const update_bid_dto_1 = require("./dto/update-bid.dto");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const get_all_bid_dto_1 = require("./dto/get-all-bid.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_bid_dashboard_graph_dto_1 = require("./dto/get-bid-dashboard-graph.dto");
let BidController = class BidController {
    constructor(bidService) {
        this.bidService = bidService;
    }
    async create(currentUser, createBidDto) {
        const bid = await this.bidService.create(currentUser, createBidDto);
        return {
            message: 'Bid created successfully',
            details: bid,
        };
    }
    async getDashboardGraph(currentUser, getBidDashboardGraphDto) {
        const graph = await this.bidService.getBidGraphStats(currentUser, getBidDashboardGraphDto.year, getBidDashboardGraphDto.organization_id);
        return {
            message: 'Graph fetched successfully',
            details: graph,
        };
    }
    async findAll(currentUser, getAllBidsDto) {
        const { items, meta } = await this.bidService.findAll(currentUser, getAllBidsDto);
        return {
            message: 'Bids fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async acceptBid(paramIdDto, currentUser) {
        const bid = await this.bidService.acceptBid(paramIdDto, currentUser);
        return {
            message: 'Bid accepted successfully',
            details: bid,
        };
    }
    async findOne(paramIdDto, currentUser) {
        const bid = await this.bidService.findOne(paramIdDto, currentUser);
        return {
            message: 'Bid found successfully',
            details: bid,
        };
    }
    async update(paramIdDto, updateBidDto) {
        const bid = await this.bidService.update(paramIdDto, updateBidDto);
        return {
            message: `Bid updated successfully`,
            details: bid,
        };
    }
};
exports.BidController = BidController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_bid_dto_1.CreateBidDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('dashboard/graph'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_bid_dashboard_graph_dto_1.GetBidDashboardGraphDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "getDashboardGraph", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_bid_dto_1.GetAllBidsDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id/accept'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "acceptBid", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.ORGANIZATION),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_bid_dto_1.UpdateBidDto]),
    __metadata("design:returntype", Promise)
], BidController.prototype, "update", null);
exports.BidController = BidController = __decorate([
    (0, common_1.Controller)('bid'),
    __metadata("design:paramtypes", [bid_service_1.BidService])
], BidController);
//# sourceMappingURL=bid.controller.js.map