import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { SizeStatus } from '../entities/size.entity';

export class GetAllSizesDto extends GetAllDto {
  @IsOptional()
  @IsEnum(SizeStatus)
  status: SizeStatus;
}
