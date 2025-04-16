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
exports.PlatformFee = exports.PlatformFeeType = exports.PlatformLabel = void 0;
const typeorm_1 = require("typeorm");
var PlatformLabel;
(function (PlatformLabel) {
    PlatformLabel["TENDER_POSTER_FEE"] = "tender_poster_fee";
    PlatformLabel["TENDER_BIDDER_FEE"] = "tender_bidder_fee";
})(PlatformLabel || (exports.PlatformLabel = PlatformLabel = {}));
var PlatformFeeType;
(function (PlatformFeeType) {
    PlatformFeeType["FIXED"] = "fixed";
    PlatformFeeType["PERCENTAGE"] = "percentage";
})(PlatformFeeType || (exports.PlatformFeeType = PlatformFeeType = {}));
let PlatformFee = class PlatformFee extends typeorm_1.BaseEntity {
};
exports.PlatformFee = PlatformFee;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PlatformFee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlatformLabel,
    }),
    __metadata("design:type", String)
], PlatformFee.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 13,
        scale: 2,
        default: '0.00',
    }),
    __metadata("design:type", Number)
], PlatformFee.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PlatformFeeType,
    }),
    __metadata("design:type", String)
], PlatformFee.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], PlatformFee.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], PlatformFee.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", Date)
], PlatformFee.prototype, "deleted_at", void 0);
exports.PlatformFee = PlatformFee = __decorate([
    (0, typeorm_1.Entity)('platform_fees')
], PlatformFee);
//# sourceMappingURL=platform-fee.entity.js.map