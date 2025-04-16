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
exports.PlatformFeesController = void 0;
const common_1 = require("@nestjs/common");
const platform_fees_service_1 = require("./platform-fees.service");
const create_platform_fee_dto_1 = require("./dto/create-platform-fee.dto");
const update_platform_fee_dto_1 = require("./dto/update-platform-fee.dto");
const getAll_dto_1 = require("../../shared/dtos/getAll.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_form_data_1 = require("nestjs-form-data");
let PlatformFeesController = class PlatformFeesController {
    constructor(platformFeesService) {
        this.platformFeesService = platformFeesService;
    }
    async create(createPlatformFeeDto) {
        const platformFee = await this.platformFeesService.create(createPlatformFeeDto);
        return {
            message: 'Platform Fee created successfully',
            details: platformFee,
        };
    }
    async findAll(getAllDto) {
        const { items, meta } = await this.platformFeesService.findAll(getAllDto);
        return {
            message: 'Platform Fees fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const platformFee = await this.platformFeesService.findOne(paramIdDto);
        return {
            message: 'Platform Fee fetched successfully',
            details: platformFee,
        };
    }
    async update(paramIdDto, updatePlatformFeeDto) {
        const updatedPlatformFee = await this.platformFeesService.update(paramIdDto, updatePlatformFeeDto);
        return {
            message: 'Platform Fee updated successfully',
            details: updatedPlatformFee,
        };
    }
};
exports.PlatformFeesController = PlatformFeesController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_platform_fee_dto_1.CreatePlatformFeeDto]),
    __metadata("design:returntype", Promise)
], PlatformFeesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [getAll_dto_1.GetAllDto]),
    __metadata("design:returntype", Promise)
], PlatformFeesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], PlatformFeesController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_platform_fee_dto_1.UpdatePlatformFeeDto]),
    __metadata("design:returntype", Promise)
], PlatformFeesController.prototype, "update", null);
exports.PlatformFeesController = PlatformFeesController = __decorate([
    (0, common_1.Controller)('platform-fees'),
    __metadata("design:paramtypes", [platform_fees_service_1.PlatformFeesService])
], PlatformFeesController);
//# sourceMappingURL=platform-fees.controller.js.map