import { MemoryStoredFile } from 'nestjs-form-data';
export declare class CreateMessageDto {
    content: string;
    recipient_id?: string;
    chat_id: string;
    file: MemoryStoredFile;
}
