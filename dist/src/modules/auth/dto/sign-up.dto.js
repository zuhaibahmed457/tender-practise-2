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
exports.SignUpDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../users/entities/user.entity");
const match_fields_decorator_1 = require("../../../shared/custom-validators/match-fields.decorator");
class SignUpDto {
}
exports.SignUpDto = SignUpDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'first_name should not contain special characters!',
    }),
    (0, class_validator_1.Length)(3, 80, {
        message: 'first_name must be 3 to 80 characters long',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "first_name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => `${value?.slice(0, 1)?.toUpperCase()}${value?.slice(1)?.toLowerCase()}`.trim()),
    (0, class_validator_1.Matches)(/^[^!@#$%^&*(),.?":{}|<>]*$/, {
        message: 'last_name should not contain special characters!',
    }),
    (0, class_validator_1.Length)(3, 80, {
        message: 'last_name must be 3 to 80 characters long',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "last_name", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase()),
    (0, class_validator_1.IsEmail)({}, { message: 'invalid email format' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsEnum)([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER], {
        message: `Role must be one of these: ${user_entity_1.UserRole.ORGANIZATION} OR ${user_entity_1.UserRole.TRANSPORTER}`,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "password", void 0);
__decorate([
    (0, match_fields_decorator_1.Match)('password', { message: 'confirm_password must match password' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDto.prototype, "confirm_password", void 0);
//# sourceMappingURL=sign-up.dto.js.map