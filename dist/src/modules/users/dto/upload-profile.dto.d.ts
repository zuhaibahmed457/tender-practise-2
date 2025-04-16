import { MemoryStoredFile } from 'nestjs-form-data';
export declare class UploadProfileDto {
    profile_image: MemoryStoredFile;
    user_id: string;
}
