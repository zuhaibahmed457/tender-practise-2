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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const transaction_entity_1 = require("./entities/transaction.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let TransactionsService = class TransactionsService {
    create(createTransactionDto) {
        return 'This action adds a new transaction';
    }
    async findAll(getAllTransactionDto, currentUser) {
        const { status, organization_id, end_date, page, per_page, search, start_date, role, price_max, price_min, } = getAllTransactionDto;
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            organization_id &&
            organization_id !== currentUser.id) {
            throw new common_1.ForbiddenException('You are not allowed to access transactions of other users.');
        }
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.user', 'user')
            .leftJoinAndSelect('transaction.bid', 'bid')
            .leftJoinAndSelect('bid.tender', 'tender')
            .leftJoinAndSelect('bid.bidder', 'bidder')
            .where('user.role NOT IN (:...roles)', {
            roles: [user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN],
        });
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role)) {
            query.andWhere('user.id = :currentUserId', {
                currentUserId: currentUser.id,
            });
        }
        if (organization_id) {
            query.andWhere('transaction.user_id = :userId', {
                userId: organization_id,
            });
        }
        if (role) {
            query.andWhere('user.role = :role', { role });
        }
        if (status) {
            query.andWhere('transaction.status = :status', { status });
        }
        if (search) {
            query.andWhere(`(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search OR tender.title ILIKE :search)`, { search: `%${search}%` });
        }
        if (price_min) {
            query.andWhere('transaction.bid_amount >= :price_min', {
                price_min,
            });
        }
        if (price_max) {
            query.andWhere('transaction.bid_amount <= :price_max', {
                price_max,
            });
        }
        if (start_date) {
            query.andWhere('transaction.created_at >= :start_date', { start_date });
        }
        if (end_date) {
            query.andWhere('transaction.created_at <= :end_date', { end_date });
        }
        query
            .distinctOn(['transaction.created_at'])
            .orderBy('transaction.created_at', 'DESC');
        const paginationOption = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOption);
    }
    findOne(id) {
        return `This action returns a #${id} transaction`;
    }
    update(id, updateTransactionDto) {
        return `This action updates a #${id} transaction`;
    }
    remove(id) {
        return `This action removes a #${id} transaction`;
    }
    async getTotalSpending(currentUser, organization_id) {
        if (currentUser.role === user_entity_1.UserRole.ORGANIZATION &&
            (!organization_id || organization_id !== currentUser.id)) {
            throw new common_1.ForbiddenException('You do not have permission to view spending for this organization');
        }
        const query = this.transactionRepository
            .createQueryBuilder('transaction')
            .select('SUM(transaction.total_amount_charged)', 'total_spending')
            .where('transaction.status = :status', {
            status: transaction_entity_1.TransactionStatus.SUCCESS,
        });
        if (organization_id) {
            query.andWhere('transaction.user_id = :organization_id', {
                organization_id,
            });
        }
        const result = await query.getRawOne();
        return {
            total_spending: parseFloat(result.total_spending || 0),
        };
    }
};
exports.TransactionsService = TransactionsService;
__decorate([
    (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction),
    __metadata("design:type", typeorm_2.Repository)
], TransactionsService.prototype, "transactionRepository", void 0);
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)()
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map