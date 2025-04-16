import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllAddressesDto extends GetAllDto {
  @IsUUID('all', { each: true })
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
