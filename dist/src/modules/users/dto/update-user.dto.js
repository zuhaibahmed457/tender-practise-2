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
exports.UpdateUserDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const class_validator_1 = require("class-validator");
const sign_up_dto_1 = require("../../auth/dto/sign-up.dto");
const user_entity_1 = require("../entities/user.entity");
class UpdateUserDto extends (0, mapped_types_1.PartialType)(sign_up_dto_1.SignUpDto) {
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, class_validator_1.IsEnum)([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER, user_entity_1.UserRole.ADMIN], {
        message: `role must be one of these: ${user_entity_1.UserRole.ORGANIZATION}  ${user_entity_1.UserRole.TRANSPORTER} OR ${user_entity_1.UserRole.ADMIN}`,
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.Length)(7, 15, { message: 'phoneNumber must be between 7 to 15 digits ' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)(({ phone_no }) => {
        if (phone_no?.length > 0) {
            return true;
        }
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "phone_no", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'invalid id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)(({ country_id }) => {
        if (country_id?.length > 0) {
            return true;
        }
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "country_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)('all', { message: 'invalid id' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)(({ company_type_id }) => {
        if (company_type_id?.length > 0) {
            return true;
        }
    }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "company_type_id", void 0);
//# sourceMappingURL=update-user.dto.js.map