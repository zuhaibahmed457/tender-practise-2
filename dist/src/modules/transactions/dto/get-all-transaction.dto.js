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
exports.GetAllTransactionDto = void 0;
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const transaction_entity_1 = require("../entities/transaction.entity");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dayjs = require("dayjs");
const user_entity_1 = require("../../users/entities/user.entity");
class GetAllTransactionDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllTransactionDto = GetAllTransactionDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(transaction_entity_1.TransactionStatus),
    __metadata("design:type", String)
], GetAllTransactionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)('all', { message: 'Invalid id' }),
    __metadata("design:type", String)
], GetAllTransactionDto.prototype, "organization_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER], {
        message: 'Role must be one of the following: organization, transporter',
    }),
    __metadata("design:type", String)
], GetAllTransactionDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetAllTransactionDto.prototype, "price_min", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], GetAllTransactionDto.prototype, "price_max", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllTransactionDto.prototype, "start_date", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    __metadata("design:type", Date)
], GetAllTransactionDto.prototype, "end_date", void 0);
//# sourceMappingURL=get-all-transaction.dto.js.map