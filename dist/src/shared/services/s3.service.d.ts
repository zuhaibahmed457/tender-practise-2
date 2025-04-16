import { ConfigService } from '@nestjs/config';
import { MemoryStoredFile } from 'nestjs-form-data';
export declare class S3Service {
    private readonly configService;
    private s3Client;
    private bucketName;
    private region;
    private nodeEnv;
    constructor(configService: ConfigService);
    uploadFile(file: MemoryStoredFile, folderPath: string): Promise<string>;
    uploadMultipleFiles(files: MemoryStoredFile[], folderPath: string): Promise<string[]>;
    deleteFile(url: string): Promise<void>;
    deleteMultipleFiles(fileUrls: string[]): Promise<void>;
}
