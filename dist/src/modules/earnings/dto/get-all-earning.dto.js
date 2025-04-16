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
exports.GetAllEarningDto = void 0;
const class_validator_1 = require("class-validator");
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const earning_entity_1 = require("../entities/earning.entity");
const user_entity_1 = require("../../users/entities/user.entity");
const dayjs_1 = require("dayjs");
const class_transformer_1 = require("class-transformer");
class GetAllEarningDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllEarningDto = GetAllEarningDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(earning_entity_1.EarningsStatus),
    __metadata("design:type", String)
], GetAllEarningDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all', { message: 'Invalid id' }),
    __metadata("design:type", String)
], GetAllEarningDto.prototype, "organization_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER], {
        message: 'Role must be one of the following: organization, transporter',
    }),
    __metadata("design:type", String)
], GetAllEarningDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, dayjs_1.default)(value).toISOString()),
    __metadata("design:type", Date)
], GetAllEarningDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => (0, dayjs_1.default)(value).toISOString()),
    __metadata("design:type", Date)
], GetAllEarningDto.prototype, "end_date", void 0);
//# sourceMappingURL=get-all-earning.dto.js.map