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
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let S3Service = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.s3Client = new client_s3_1.S3Client({
            region: this.configService.get('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.get('AWS_S3_ACCESS_KEY_SECRET_ACCESS_KEY'),
            },
        });
        this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
        this.region = this.configService.get('AWS_S3_REGION');
        this.nodeEnv = this.configService.get('NODE_ENV');
    }
    async uploadFile(file, folderPath) {
        if (!file) {
            return;
        }
        const uploadParam = {
            Bucket: this.bucketName,
            Body: file.buffer,
            Key: `${this.nodeEnv}/${folderPath}/${Date.now()}-${file.originalName.split(' ').join('-')}`,
            ContentType: file.mimeType,
        };
        const response = await this.s3Client.send(new client_s3_1.PutObjectCommand(uploadParam));
        if (response.$metadata.httpStatusCode === 200) {
            return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${uploadParam.Key}`;
        }
        else {
            throw new common_1.BadRequestException('Failed to upload file');
        }
    }
    async uploadMultipleFiles(files, folderPath) {
        if (!files || files.length === 0) {
            return [];
        }
        const uploadPromises = files.map(async (file) => {
            const uploadParam = {
                Bucket: this.bucketName,
                Body: file.buffer,
                Key: `${this.nodeEnv}/${folderPath}/${Date.now()}-${file.originalName.split(' ').join('-')}`,
                ContentType: file.mimeType,
            };
            return this.s3Client
                .send(new client_s3_1.PutObjectCommand(uploadParam))
                .then((response) => {
                if (response.$metadata.httpStatusCode === 200) {
                    return `https://s3.${this.region}.amazonaws.com/${this.bucketName}/${uploadParam.Key}`;
                }
                else {
                    throw new common_1.BadRequestException(`Failed to upload file: ${file.originalName}`);
                }
            });
        });
        const uploadedUrls = await Promise.all(uploadPromises);
        return uploadedUrls;
    }
    async deleteFile(url) {
        if (!url) {
            return;
        }
        function extractS3Key(fileUrl, bucketName, region) {
            const baseUrl = `https://s3.${region}.amazonaws.com/${bucketName}/`;
            return fileUrl.replace(baseUrl, '');
        }
        const fileKey = extractS3Key(url, this.bucketName, this.region);
        const deleteParams = {
            Bucket: this.bucketName,
            Key: fileKey,
        };
        await this.s3Client.send(new client_s3_1.DeleteObjectCommand(deleteParams));
    }
    async deleteMultipleFiles(fileUrls) {
        if (!fileUrls || fileUrls.length === 0) {
            return;
        }
        function extractS3Key(fileUrl, bucketName, region) {
            const baseUrl = `https://s3.${region}.amazonaws.com/${bucketName}/`;
            return fileUrl.replace(baseUrl, '');
        }
        const fileKeys = fileUrls.map((url) => extractS3Key(url, this.bucketName, this.region));
        const deleteParams = {
            Bucket: this.bucketName,
            Delete: {
                Objects: fileKeys.map((fileKey) => ({
                    Key: fileKey,
                })),
            },
        };
        await this.s3Client.send(new client_s3_1.DeleteObjectsCommand(deleteParams));
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map