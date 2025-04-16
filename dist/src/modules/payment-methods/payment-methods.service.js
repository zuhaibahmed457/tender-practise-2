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
exports.PaymentMethodsService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../users/entities/user.entity");
const payment_method_entity_1 = require("./entities/payment-method.entity");
const stripe_1 = require("stripe");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const transaction_manager_service_1 = require("../../shared/services/transaction-manager.service");
let PaymentMethodsService = class PaymentMethodsService {
    constructor(paymentMethodRepository, usersRepository, stripe, transactionManagerService) {
        this.paymentMethodRepository = paymentMethodRepository;
        this.usersRepository = usersRepository;
        this.stripe = stripe;
        this.transactionManagerService = transactionManagerService;
    }
    async create(currentUser, createPaymentMethodDto) {
        if (!currentUser.stripe_customer_id) {
            const stripeCustomer = await this.stripe.customers.create({
                email: currentUser.email,
                name: `${currentUser.first_name} ${currentUser.last_name}`,
            });
            currentUser.stripe_customer_id = stripeCustomer.id;
            await this.usersRepository.save(currentUser);
        }
        const setupIntent = await this.stripe.setupIntents.create({
            customer: currentUser.stripe_customer_id,
            payment_method_types: createPaymentMethodDto.payment_method_types,
        });
        return { setup_intent_client_secret: setupIntent.client_secret };
    }
    async findAll(currentUser, getAllPaymentMethodsDto) {
        const { page, per_page } = getAllPaymentMethodsDto;
        const query = this.paymentMethodRepository
            .createQueryBuilder('payment_method')
            .where('payment_method.user_id = :id', { id: currentUser.id })
            .orderBy('created_at', 'DESC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: {
                id,
                user: {
                    id: currentUser.id,
                },
            },
        });
        if (!paymentMethod) {
            throw new common_1.NotFoundException('Payment method not found');
        }
        return paymentMethod;
    }
    update(id, updatePaymentMethodDto) {
        return `This action updates a #${id} paymentMethod`;
    }
    async markDefault({ id }, currentUser) {
        const payment = await this.paymentMethodRepository.findOne({
            where: {
                id,
                user: {
                    id: currentUser.id,
                },
            },
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment method not found');
        await this.paymentMethodRepository
            .createQueryBuilder()
            .update(payment_method_entity_1.PaymentMethod)
            .set({ is_default: false })
            .where('payment_method.user_id = :userId', { userId: currentUser.id })
            .andWhere('payment_method.id != :id', { id })
            .execute();
        payment.is_default = true;
        await this.paymentMethodRepository.save(payment);
        return payment;
    }
    async remove({ id }, currentUser) {
        const paymentMethod = await this.paymentMethodRepository.findOne({
            where: {
                id,
                user: {
                    id: currentUser.id,
                },
            },
        });
        if (!paymentMethod)
            throw new common_1.NotFoundException('Payment method not found');
        if (paymentMethod.is_default)
            throw new common_1.BadRequestException("you can't delete default payment method");
        return await this.paymentMethodRepository.remove(paymentMethod);
    }
    async savePaymentMethod(paymentMethod) {
        await this.transactionManagerService.executeInTransaction(async (queryRunner) => {
            const user = await queryRunner.manager.findOne(user_entity_1.User, {
                where: {
                    stripe_customer_id: paymentMethod.customer,
                },
            });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
            }
            const newPaymentMethod = queryRunner.manager.create(payment_method_entity_1.PaymentMethod, {
                user: user,
                stripe_payment_method_id: paymentMethod.id,
                type: paymentMethod.type,
                last4: paymentMethod?.card?.last4 || paymentMethod?.us_bank_account?.last4,
                brand: paymentMethod?.card?.brand,
                expiry_month: paymentMethod?.card?.exp_month,
                expiry_year: paymentMethod?.card?.exp_year,
                bank_name: paymentMethod?.us_bank_account?.bank_name,
            });
            const paymentMethodExists = await queryRunner.manager.findOne(payment_method_entity_1.PaymentMethod, {
                where: {
                    user: {
                        id: user.id,
                    },
                },
            });
            if (!paymentMethodExists) {
                newPaymentMethod.is_default = true;
            }
            user.payment_method_status = user_entity_1.UserPaymentMethodStatus.PROVIDED;
            await queryRunner.manager.save(user);
            await queryRunner.manager.save(newPaymentMethod);
            return newPaymentMethod;
        });
    }
};
exports.PaymentMethodsService = PaymentMethodsService;
exports.PaymentMethodsService = PaymentMethodsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_method_entity_1.PaymentMethod)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_1.default,
        transaction_manager_service_1.TransactionManagerService])
], PaymentMethodsService);
//# sourceMappingURL=payment-methods.service.js.map