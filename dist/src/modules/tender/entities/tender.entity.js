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
exports.Tender = exports.TenderStatus = void 0;
const address_entity_1 = require("../../address/entities/address.entity");
const bid_entity_1 = require("../../bid/entities/bid.entity");
const industry_entity_1 = require("../../industry/entities/industry.entity");
const media_entity_1 = require("../../media/entities/media.entity");
const review_rating_entity_1 = require("../../review-rating/entities/review-rating.entity");
const size_entity_1 = require("../../sizes/entities/size.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
var TenderStatus;
(function (TenderStatus) {
    TenderStatus["DRAFT"] = "draft";
    TenderStatus["PENDING_APPROVAL"] = "pending_approval";
    TenderStatus["APPROVED"] = "approved";
    TenderStatus["REJECTED"] = "rejected";
    TenderStatus["IN_ACTIVE"] = "in_active";
    TenderStatus["IN_TRANSACTION"] = "in_transaction";
    TenderStatus["IN_PROGRESS"] = "in_progress";
    TenderStatus["DELIVERED"] = "delivered";
    TenderStatus["RECEIVED"] = "received";
})(TenderStatus || (exports.TenderStatus = TenderStatus = {}));
let Tender = class Tender extends typeorm_1.BaseEntity {
};
exports.Tender = Tender;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Tender.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Tender.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Tender.prototype, "bid_deadline", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], Tender.prototype, "tender_budget_amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => size_entity_1.Size, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)({ name: 'size_id' }),
    __metadata("design:type", size_entity_1.Size)
], Tender.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => industry_entity_1.Industry, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinTable)({
        name: 'tender_industries',
        joinColumn: {
            name: 'tender_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'industry_id',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Tender.prototype, "industries", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TenderStatus,
        default: TenderStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Tender.prototype, "tender_status", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], Tender.prototype, "transporter_required", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Tender.prototype, "transportation_budget_amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Tender.prototype, "is_archived", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], Tender.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'pickup_address_id' }),
    __metadata("design:type", address_entity_1.Address)
], Tender.prototype, "pickup_address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => address_entity_1.Address, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'dropoff_address_id' }),
    __metadata("design:type", address_entity_1.Address)
], Tender.prototype, "dropoff_address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => media_entity_1.Media, (media) => media.tender),
    __metadata("design:type", Array)
], Tender.prototype, "medias", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => media_entity_1.Media, { onDelete: 'SET NULL', nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'tender_image_id' }),
    __metadata("design:type", media_entity_1.Media)
], Tender.prototype, "tender_image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'SET NULL', nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by_id' }),
    __metadata("design:type", user_entity_1.User)
], Tender.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_rating_entity_1.ReviewRating, (reviews) => reviews.tender),
    __metadata("design:type", Array)
], Tender.prototype, "reviews_rating", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => bid_entity_1.Bid, (bid) => bid.tender),
    __metadata("design:type", Array)
], Tender.prototype, "bids", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Tender.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Tender.prototype, "updated_at", void 0);
exports.Tender = Tender = __decorate([
    (0, typeorm_1.Entity)('tender')
], Tender);
//# sourceMappingURL=tender.entity.js.map