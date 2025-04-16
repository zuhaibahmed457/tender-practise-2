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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaController = void 0;
const common_1 = require("@nestjs/common");
const media_service_1 = require("./media.service");
const create_media_dto_1 = require("./dto/create-media.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
const nestjs_form_data_1 = require("nestjs-form-data");
let MediaController = class MediaController {
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    async createMedia(currentUser, createMediaDto) {
        const media = await this.mediaService.createMedia(currentUser, createMediaDto);
        return {
            message: 'Media Uploaded successfully',
            details: media,
        };
    }
    async deleteMedia(currentUser, paramIdDto) {
        const media = await this.mediaService.deleteMedia(currentUser, paramIdDto);
        return {
            message: 'Media deleted successfully',
            details: media,
        };
    }
};
exports.MediaController = MediaController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        create_media_dto_1.CreateMediaDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "createMedia", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], MediaController.prototype, "deleteMedia", null);
exports.MediaController = MediaController = __decorate([
    (0, common_1.Controller)('media'),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaController);
//# sourceMappingURL=media.controller.js.map