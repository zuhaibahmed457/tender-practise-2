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
exports.CreateTenderDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const dayjs = require("dayjs");
const to_boolean_1 = require("../../../utils/to-boolean");
const common_1 = require("@nestjs/common");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateTenderDto {
    constructor() {
        this.transporter_required = false;
    }
}
exports.CreateTenderDto = CreateTenderDto;
__decorate([
    (0, class_validator_1.Length)(2, 255, { message: 'Title must be between 2 and 255 characters' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenderDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    (0, class_transformer_1.Transform)(({ value }) => dayjs(value).toISOString()),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Date)
], CreateTenderDto.prototype, "bid_deadline", void 0);
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Max)(1000000000),
    __metadata("design:type", Number)
], CreateTenderDto.prototype, "tender_budget_amount", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all'),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTenderDto.prototype, "size_id", void 0);
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Max)(1000000000),
    __metadata("design:type", Number)
], CreateTenderDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { each: true }),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateTenderDto.prototype, "industry_ids", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Boolean)
], CreateTenderDto.prototype, "transporter_required", void 0);
__decorate([
    (0, class_validator_1.IsPositive)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateIf)((o) => {
        if (o.transporter_required) {
            return true;
        }
        else if (!o.transporter_required && o.transportation_budget_amount) {
            throw new common_1.BadRequestException('Transportation budget amount is not allowed when transporter is not required.');
        }
    }),
    __metadata("design:type", Number)
], CreateTenderDto.prototype, "transportation_budget_amount", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenderDto.prototype, "pickup_address_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTenderDto.prototype, "dropoff_address_id", void 0);
__decorate([
    (0, nestjs_form_data_1.HasExtension)(['jpeg', 'png', 'jpg']),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png', 'image/jpg']),
    (0, nestjs_form_data_1.IsFile)({ message: 'Image must be an image' }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", nestjs_form_data_1.MemoryStoredFile)
], CreateTenderDto.prototype, "tender_image", void 0);
//# sourceMappingURL=create-tender.dto.js.map