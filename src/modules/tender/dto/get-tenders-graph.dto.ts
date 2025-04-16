import {
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetTendersGraphDto {

  @IsUUID('all')
  @IsOptional()
  organization_id?: string;

  @IsNumber()
  year: number;
}
