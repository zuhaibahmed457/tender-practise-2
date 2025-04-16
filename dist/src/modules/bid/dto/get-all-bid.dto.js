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
exports.GetAllBidsDto = void 0;
const class_validator_1 = require("class-validator");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const bid_entity_1 = require("../entities/bid.entity");
const class_transformer_1 = require("class-transformer");
const dayjs = require("dayjs");
class GetAllBidsDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllBidsDto = GetAllBidsDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetAllBidsDto.prototype, "tender_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(bid_entity_1.BidStatus),
    __metadata("design:type", String)
], GetAllBidsDto.prototype, "bid_status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetAllBidsDto.prototype, "bidder_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], GetAllBidsDto.prototype, "poster_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllBidsDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllBidsDto.prototype, "end_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllBidsDto.prototype, "delivery_date_start", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllBidsDto.prototype, "delivery_date_end", void 0);
//# sourceMappingURL=get-all-bid.dto.js.map