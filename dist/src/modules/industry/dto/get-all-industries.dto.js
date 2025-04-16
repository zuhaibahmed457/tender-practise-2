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
exports.GetAllIndustriesDto = void 0;
const getAll_dto_1 = require("../../../shared/dtos/getAll.dto");
const class_validator_1 = require("class-validator");
const industry_entity_1 = require("../entities/industry.entity");
const to_boolean_1 = require("../../../utils/to-boolean");
const common_1 = require("@nestjs/common");
class GetAllIndustriesDto extends getAll_dto_1.GetAllDto {
}
exports.GetAllIndustriesDto = GetAllIndustriesDto;
__decorate([
    (0, class_validator_1.IsEnum)(industry_entity_1.IndustryStatus),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllIndustriesDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetAllIndustriesDto.prototype, "user_id", void 0);
__decorate([
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((o) => {
        if (o.only_include_mine && o.exclude_mine) {
            throw new common_1.BadRequestException('Only include mind and exclude mine should not be used in a single call');
        }
        return true;
    }),
    __metadata("design:type", Boolean)
], GetAllIndustriesDto.prototype, "exclude_mine", void 0);
__decorate([
    (0, to_boolean_1.ToBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], GetAllIndustriesDto.prototype, "only_include_mine", void 0);
//# sourceMappingURL=get-all-industries.dto.js.map