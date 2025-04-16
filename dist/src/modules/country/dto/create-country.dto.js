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
exports.CreateCountryDto = void 0;
const class_validator_1 = require("class-validator");
const country_entity_1 = require("../entities/country.entity");
class CreateCountryDto {
}
exports.CreateCountryDto = CreateCountryDto;
__decorate([
    (0, class_validator_1.IsString)({ message: 'Country code must be a string' }),
    (0, class_validator_1.Length)(3, 3, { message: 'Country code must be exactly 3 characters' }),
    (0, class_validator_1.Matches)(/^[A-Z]+$/, { message: 'Country code must contain only uppercase letters' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Country name must be a string' }),
    (0, class_validator_1.MaxLength)(255, { message: 'Country name cannot exceed 255 characters' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'Country code must be a string' }),
    (0, class_validator_1.MaxLength)(10, { message: 'Country code cannot exceed 10 characters' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "country_code", void 0);
__decorate([
    (0, class_validator_1.IsEnum)(country_entity_1.CountryStatuses, { message: 'Invalid status' }),
    __metadata("design:type", String)
], CreateCountryDto.prototype, "status", void 0);
//# sourceMappingURL=create-country.dto.js.map