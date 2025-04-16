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
exports.GetAllTendersDto = void 0;
const class_validator_1 = require("class-validator");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const tender_entity_1 = require("../entities/tender.entity");
const to_boolean_1 = require("../../../utils/to-boolean");
const class_transformer_1 = require("class-transformer");
const dayjs = require("dayjs");
class GetAllTendersDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllTendersDto = GetAllTendersDto;
__decorate([
    (0, class_validator_1.IsEnum)(tender_entity_1.TenderStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "tender_status", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "created_by_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "industry_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "size_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "company_type_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetAllTendersDto.prototype, "price_min", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetAllTendersDto.prototype, "price_max", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllTendersDto.prototype, "exclude_mine", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllTendersDto.prototype, "exclude_archived", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllTendersDto.prototype, "exclude_already_bidded", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllTendersDto.prototype, "organization_bidder_id", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllTendersDto.prototype, "exclude_expired", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], GetAllTendersDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], GetAllTendersDto.prototype, "end_date", void 0);
//# sourceMappingURL=get-all-tenders.dto.js.map