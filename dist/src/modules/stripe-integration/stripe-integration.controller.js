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
exports.StripeIntegrationController = void 0;
const common_1 = require("@nestjs/common");
const stripe_integration_service_1 = require("./stripe-integration.service");
const create_stripe_integration_dto_1 = require("./dto/create-stripe-integration.dto");
const update_stripe_integration_dto_1 = require("./dto/update-stripe-integration.dto");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("../users/entities/user.entity");
const payment_methods_service_1 = require("../payment-methods/payment-methods.service");
const earnings_service_1 = require("../earnings/earnings.service");
let StripeIntegrationController = class StripeIntegrationController {
    constructor(stripe, stripeIntegrationService, configService, paymentMethodsService, earningService) {
        this.stripe = stripe;
        this.stripeIntegrationService = stripeIntegrationService;
        this.configService = configService;
        this.paymentMethodsService = paymentMethodsService;
        this.earningService = earningService;
    }
    async platformWebhook(req, res, signature) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.body, signature, this.configService.get('STRIPE_PLATFORM_WEBHOOK_SECRET'));
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        const eventDataObject = event.data.object;
        if (event.type === 'payment_method.attached') {
            await this.paymentMethodsService.savePaymentMethod(eventDataObject);
        }
        else if (event.type === 'payment_intent.succeeded') {
            await this.stripeIntegrationService.processPaymentIntentSuccess(event);
        }
        else if (event.type === 'payment_intent.payment_failed') {
            await this.stripeIntegrationService.processPaymentIntentFailed(event);
        }
        return res.status(200).json({
            message: 'Webhook received successfully',
        });
    }
    async paymentMethodWebhook(req, res, signature) {
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(req.body, signature, this.configService.get('STRIPE_CONNECT_ACCOUNT_WEBHOOK_SECRET'));
        }
        catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            throw new common_1.BadRequestException('Invalid webhook signature');
        }
        const eventDataObject = event.data.object;
        if (event.type === 'account.updated' &&
            eventDataObject?.charges_enabled &&
            eventDataObject?.payouts_enabled &&
            eventDataObject?.details_submitted) {
            await this.stripeIntegrationService.markUserConnectAccount(eventDataObject, user_entity_1.ConnectAccountStatus.CONNECTED);
        }
        if (event.type === 'account.updated' &&
            eventDataObject?.details_submitted &&
            (!eventDataObject?.payouts_enabled || !eventDataObject?.charges_enabled)) {
            await this.stripeIntegrationService.markUserConnectAccount(eventDataObject, user_entity_1.ConnectAccountStatus.UNDER_REVIEW);
        }
        if (event.type === 'transfer.reversed') {
            await this.earningService.handleEarningsTransferFailed(event.data.object.metadata.transaction);
        }
        return res.status(200).json({
            message: 'Webhook received successfully',
        });
    }
    create(createStripeIntegrationDto) {
        return this.stripeIntegrationService.create(createStripeIntegrationDto);
    }
    findAll() {
        return this.stripeIntegrationService.findAll();
    }
    findOne(id) {
        return this.stripeIntegrationService.findOne(+id);
    }
    update(id, updateStripeIntegrationDto) {
        return this.stripeIntegrationService.update(+id, updateStripeIntegrationDto);
    }
    remove(id) {
        return this.stripeIntegrationService.remove(+id);
    }
};
exports.StripeIntegrationController = StripeIntegrationController;
__decorate([
    (0, common_1.Post)('platform-webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeIntegrationController.prototype, "platformWebhook", null);
__decorate([
    (0, common_1.Post)('connect-account-webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], StripeIntegrationController.prototype, "paymentMethodWebhook", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_stripe_integration_dto_1.CreateStripeIntegrationDto]),
    __metadata("design:returntype", void 0)
], StripeIntegrationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], StripeIntegrationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StripeIntegrationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_stripe_integration_dto_1.UpdateStripeIntegrationDto]),
    __metadata("design:returntype", void 0)
], StripeIntegrationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StripeIntegrationController.prototype, "remove", null);
exports.StripeIntegrationController = StripeIntegrationController = __decorate([
    (0, common_1.Controller)('stripe-integration'),
    __param(0, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [stripe_1.default,
        stripe_integration_service_1.StripeIntegrationService,
        config_1.ConfigService,
        payment_methods_service_1.PaymentMethodsService,
        earnings_service_1.EarningsService])
], StripeIntegrationController);
//# sourceMappingURL=stripe-integration.controller.js.map