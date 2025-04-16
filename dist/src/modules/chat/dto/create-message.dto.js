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
exports.CreateMessageDto = void 0;
const class_validator_1 = require("class-validator");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateMessageDto {
}
exports.CreateMessageDto = CreateMessageDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "recipient_id", void 0);
__decorate([
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateMessageDto.prototype, "chat_id", void 0);
__decorate([
    (0, nestjs_form_data_1.HasExtension)(['jpeg', 'png', 'jpg', 'pdf', 'csv']),
    (0, nestjs_form_data_1.HasMimeType)(['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/csv']),
    (0, nestjs_form_data_1.IsFile)({ message: 'File must be an image or pdf/csv file' }),
    (0, nestjs_form_data_1.MaxFileSize)(2 * 1024 * 1024, { message: "File size must not exceed 10MB" }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", nestjs_form_data_1.MemoryStoredFile)
], CreateMessageDto.prototype, "file", void 0);
//# sourceMappingURL=create-message.dto.js.map