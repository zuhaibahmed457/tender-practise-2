import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class GetAllChatsDto extends GetAllDto {
    chat_id?: string;
    user_id: string;
}
