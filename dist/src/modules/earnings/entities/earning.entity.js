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
exports.Earning = exports.EarningsStatus = void 0;
const bid_entity_1 = require("../../bid/entities/bid.entity");
const tender_entity_1 = require("../../tender/entities/tender.entity");
const transaction_entity_1 = require("../../transactions/entities/transaction.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var EarningsStatus;
(function (EarningsStatus) {
    EarningsStatus["PAID"] = "PAID";
    EarningsStatus["REVERSED"] = "REVERSED";
})(EarningsStatus || (exports.EarningsStatus = EarningsStatus = {}));
let Earning = class Earning {
};
exports.Earning = Earning;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Earning.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Earning.prototype, "total_earned", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Earning.prototype, "platform_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Earning.prototype, "bid_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Earning.prototype, "stripe_transfer_payment_intent_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => transaction_entity_1.Transaction, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'transaction_id' }),
    __metadata("design:type", transaction_entity_1.Transaction)
], Earning.prototype, "transaction", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bid_entity_1.Bid),
    (0, typeorm_1.JoinColumn)({ name: 'bid_id' }),
    __metadata("design:type", bid_entity_1.Bid)
], Earning.prototype, "bid", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tender_entity_1.Tender),
    (0, typeorm_1.JoinColumn)({ name: 'tender_id' }),
    __metadata("design:type", tender_entity_1.Tender)
], Earning.prototype, "tender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Earning.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EarningsStatus,
        default: EarningsStatus.PAID,
    }),
    __metadata("design:type", String)
], Earning.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Earning.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Earning.prototype, "updated_at", void 0);
exports.Earning = Earning = __decorate([
    (0, typeorm_1.Entity)('earning')
], Earning);
//# sourceMappingURL=earning.entity.js.map