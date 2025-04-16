import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { HasExtension, HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsUUID()
  @IsOptional()
  recipient_id?: string;

  @IsUUID()
  chat_id: string;

  @HasExtension(['jpeg', 'png', 'jpg', 'pdf', 'csv'])
  @HasMimeType(['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'text/csv'])
  @IsFile({ message: 'File must be an image or pdf/csv file' })
  @MaxFileSize(2 * 1024 * 1024, { message: "File size must not exceed 10MB" })
  @IsOptional()
  file: MemoryStoredFile;

}

