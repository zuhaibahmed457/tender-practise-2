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
exports.CountryController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const roles_decorator_1 = require("../../shared/guards/roles.decorator");
const roles_guard_1 = require("../../shared/guards/roles.guard");
const create_country_dto_1 = require("./dto/create-country.dto");
const update_country_dto_1 = require("./dto/update-country.dto");
const country_service_1 = require("./country.service");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_all_country_dto_1 = require("./dto/get-all-country.dto");
let CountryController = class CountryController {
    constructor(countryService) {
        this.countryService = countryService;
    }
    async create(createCountryDto, user) {
        const country = await this.countryService.create(createCountryDto);
        return {
            message: 'Country created successfully',
            details: country,
        };
    }
    async findAll(getAllCountryDto, user) {
        const { items, meta } = await this.countryService.findAll(getAllCountryDto, user);
        return {
            message: 'Countries fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const country = await this.countryService.findOne(paramIdDto);
        return {
            message: 'Country fetched successfully',
            details: country,
        };
    }
    async update(paramIdDto, updateCountryDto, user) {
        const updatedCountry = await this.countryService.update(paramIdDto, updateCountryDto);
        return {
            message: 'Country updated successfully',
            details: updatedCountry,
        };
    }
    async remove(paramIdDto) {
        await this.countryService.remove(paramIdDto);
        return {
            message: 'Country deleted successfully',
        };
    }
};
exports.CountryController = CountryController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_country_dto_1.CreateCountryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_country_dto_1.GetAllCountryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_country_dto_1.UpdateCountryDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.RolesDecorator)(user_entity_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], CountryController.prototype, "remove", null);
exports.CountryController = CountryController = __decorate([
    (0, common_1.Controller)('country'),
    __metadata("design:paramtypes", [country_service_1.CountryService])
], CountryController);
//# sourceMappingURL=country.controller.js.map