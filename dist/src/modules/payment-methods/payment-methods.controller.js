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
exports.PaymentMethodsController = void 0;
const common_1 = require("@nestjs/common");
const payment_methods_service_1 = require("./payment-methods.service");
const create_payment_method_dto_1 = require("./dto/create-payment-method.dto");
const update_payment_method_dto_1 = require("./dto/update-payment-method.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const stripe_1 = require("stripe");
const get_all_payment_methods_dto_1 = require("./dto/get-all-payment-methods.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
let PaymentMethodsController = class PaymentMethodsController {
    constructor(stripe, paymentMethodsService) {
        this.stripe = stripe;
        this.paymentMethodsService = paymentMethodsService;
    }
    async create(currentUser, createPaymentMethodDto) {
        const paymentMethod = await this.paymentMethodsService.create(currentUser, createPaymentMethodDto);
        return {
            message: 'Proceeding to stripe',
            details: paymentMethod,
        };
    }
    async findAll(currentUser, getAllPaymentMethodsDto) {
        const { items, meta } = await this.paymentMethodsService.findAll(currentUser, getAllPaymentMethodsDto);
        return {
            message: 'Payment methods fetched successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto, CurrentUser) {
        const payment = await this.paymentMethodsService.findOne(paramIdDto, CurrentUser);
        return {
            message: 'Payment fetched successfully',
            details: payment,
        };
    }
    update(id, updatePaymentMethodDto) {
        return this.paymentMethodsService.update(+id, updatePaymentMethodDto);
    }
    async markDefault(ParamIdDto, currentUser) {
        const updateDefault = await this.paymentMethodsService.markDefault(ParamIdDto, currentUser);
        return {
            message: 'Payment method  set to default successfully',
        };
    }
    async remove(paramIdDto, CurrentUser) {
        const payment = await this.paymentMethodsService.remove(paramIdDto, CurrentUser);
        await this.stripe.customers.deleteSource(CurrentUser.stripe_customer_id, payment.stripe_payment_method_id);
        return {
            message: 'Payment deleted successfully',
        };
    }
};
exports.PaymentMethodsController = PaymentMethodsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_payment_method_dto_1.CreatePaymentMethodDto]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        get_all_payment_methods_dto_1.GetAllPaymentMethodsDto]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_payment_method_dto_1.UpdatePaymentMethodDto]),
    __metadata("design:returntype", void 0)
], PaymentMethodsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('/mark-default/:id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "markDefault", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], PaymentMethodsController.prototype, "remove", null);
exports.PaymentMethodsController = PaymentMethodsController = __decorate([
    (0, common_1.Controller)('payment-methods'),
    __param(0, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [stripe_1.default,
        payment_methods_service_1.PaymentMethodsService])
], PaymentMethodsController);
//# sourceMappingURL=payment-methods.controller.js.map