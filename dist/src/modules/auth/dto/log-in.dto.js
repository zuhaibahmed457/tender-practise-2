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
exports.LogInDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const user_entity_1 = require("../../users/entities/user.entity");
class LogInDto {
}
exports.LogInDto = LogInDto;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value.toLowerCase().trim()),
    (0, class_validator_1.IsEmail)({}, { message: 'enter Valid email' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'email should not be empty' }),
    __metadata("design:type", String)
], LogInDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LogInDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsEnum)([
        user_entity_1.UserRole.SUPER_ADMIN,
        user_entity_1.UserRole.ADMIN,
        user_entity_1.UserRole.ORGANIZATION,
        user_entity_1.UserRole.TRANSPORTER,
    ], {
        each: true,
        message: `role must be: ${user_entity_1.UserRole.SUPER_ADMIN} OR ${user_entity_1.UserRole.ADMIN} OR ${user_entity_1.UserRole.ORGANIZATION} OR ${user_entity_1.UserRole.TRANSPORTER}`,
    }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], LogInDto.prototype, "roles", void 0);
//# sourceMappingURL=log-in.dto.js.map