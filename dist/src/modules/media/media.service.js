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
exports.MediaService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const media_entity_1 = require("./entities/media.entity");
const typeorm_2 = require("typeorm");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const s3_service_1 = require("../../shared/services/s3.service");
const media_size_enum_1 = require("./enums/media-size.enum");
let MediaService = class MediaService {
    constructor(mediaRepo, s3Service) {
        this.mediaRepo = mediaRepo;
        this.s3Service = s3Service;
    }
    async createMedia(currentUser, createMediaDto) {
        const { file, folder_path } = createMediaDto;
        const fileType = file.mimeType.split('/')[0];
        let type;
        if (fileType === media_entity_1.MediaType.IMAGE) {
            if (file.size > media_size_enum_1.MediaSize.IMAGE_SIZE_LIMIT) {
                throw new common_1.BadRequestException('Image size should not exceed 10MB');
            }
            type = media_entity_1.MediaType.IMAGE;
        }
        if (fileType === media_entity_1.MediaType.VIDEO) {
            if (file.size > media_size_enum_1.MediaSize.VIDEO_SIZE_LIMIT) {
                throw new common_1.BadRequestException('Video size should not exceed 100MB');
            }
            type = media_entity_1.MediaType.VIDEO;
        }
        if (fileType === 'application' && file.mimeType.includes('pdf')) {
            type = media_entity_1.MediaType.PDF;
        }
        const url = await this.s3Service.uploadFile(file, folder_path);
        const media = this.mediaRepo.create({
            type,
            url,
            created_by: currentUser,
        });
        return await media.save();
    }
    async deleteMedia(currentUser, { id }) {
        const media = await this.mediaRepo.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        if (!media)
            throw new common_1.NotFoundException('Media not found');
        await this.s3Service.deleteFile(media?.url);
        await this.mediaRepo.remove(media);
    }
    async deleteMultipleFiles({ id }) {
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = __decorate([
    (0, common_1.Injectable)(),
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    __param(0, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        s3_service_1.S3Service])
], MediaService);
//# sourceMappingURL=media.service.js.map