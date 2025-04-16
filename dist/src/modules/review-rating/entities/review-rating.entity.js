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
exports.ReviewRating = void 0;
const tender_entity_1 = require("../../tender/entities/tender.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const typeorm_1 = require("typeorm");
let ReviewRating = class ReviewRating extends typeorm_1.BaseEntity {
};
exports.ReviewRating = ReviewRating;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ReviewRating.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ReviewRating.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], ReviewRating.prototype, "review", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ReviewRating.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.given_ratings, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'given_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ReviewRating.prototype, "given_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.received_ratings, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'received_by_id' }),
    __metadata("design:type", user_entity_1.User)
], ReviewRating.prototype, "given_to", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => tender_entity_1.Tender, (tender) => tender.reviews_rating, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'tender_id' }),
    __metadata("design:type", tender_entity_1.Tender)
], ReviewRating.prototype, "tender", void 0);
exports.ReviewRating = ReviewRating = __decorate([
    (0, typeorm_1.Entity)('review_rating')
], ReviewRating);
//# sourceMappingURL=review-rating.entity.js.map