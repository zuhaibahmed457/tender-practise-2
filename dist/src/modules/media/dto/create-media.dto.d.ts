import { MemoryStoredFile } from 'nestjs-form-data';
export declare class CreateMediaDto {
    file: MemoryStoredFile;
    folder_path: string;
}
