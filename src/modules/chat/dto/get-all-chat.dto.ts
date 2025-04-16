import { IsEnum, IsOptional, IsUUID, IsDateString, IsString } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllChatsDto extends GetAllDto {

  @IsOptional()
  @IsUUID()
  chat_id?: string;

  @IsOptional()
  @IsUUID()
  user_id:string

}
