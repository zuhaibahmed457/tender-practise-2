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
exports.AddressController = void 0;
const common_1 = require("@nestjs/common");
const address_service_1 = require("./address.service");
const create_address_dto_1 = require("./dto/create-address.dto");
const update_address_dto_1 = require("./dto/update-address.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const user_entity_1 = require("../users/entities/user.entity");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const get_all_addresses_dto_1 = require("./dto/get-all-addresses.dto");
let AddressController = class AddressController {
    constructor(addressService) {
        this.addressService = addressService;
    }
    async create(user, createAddressDto) {
        const address = await this.addressService.create(user, createAddressDto);
        return {
            message: 'Address Created Successfully',
            details: address,
        };
    }
    async findAll(currentUser, getAllAddressesDto) {
        const { items, meta } = await this.addressService.findAll(currentUser, getAllAddressesDto);
        return {
            message: 'Address fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(currentUser, paramIdDto) {
        const address = await this.addressService.findOne(paramIdDto, currentUser);
        return {
            message: 'Address fetched successfully',
            details: address,
        };
    }
    async update(currentUser, paramIdDto, updateAddressDto) {
        const updatedAddress = await this.addressService.update(paramIdDto, updateAddressDto, currentUser);
        return {
            message: 'Address updated successfully',
            details: updatedAddress,
        };
    }
    async remove(currentUser, paramIdDto) {
        const deletedAddress = await this.addressService.remove(paramIdDto, currentUser);
        return {
            message: 'Address deleted successfully',
        };
    }
};
exports.AddressController = AddressController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_address_dto_1.CreateAddressDto]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_addresses_dto_1.GetAllAddressesDto]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto,
        update_address_dto_1.UpdateAddressDto]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], AddressController.prototype, "remove", null);
exports.AddressController = AddressController = __decorate([
    (0, common_1.Controller)('address'),
    __metadata("design:paramtypes", [address_service_1.AddressService])
], AddressController);
//# sourceMappingURL=address.controller.js.map