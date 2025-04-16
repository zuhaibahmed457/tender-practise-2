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
exports.CreateAttachmentDto = void 0;
const class_validator_1 = require("class-validator");
const nestjs_form_data_1 = require("nestjs-form-data");
class CreateAttachmentDto {
}
exports.CreateAttachmentDto = CreateAttachmentDto;
__decorate([
    (0, nestjs_form_data_1.IsFile)({ message: 'must be a file' }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", nestjs_form_data_1.MemoryStoredFile)
], CreateAttachmentDto.prototype, "file", void 0);
//# sourceMappingURL=create-attachment.dto.js.map