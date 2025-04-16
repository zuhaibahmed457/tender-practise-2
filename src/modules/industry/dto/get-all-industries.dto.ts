import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { IndustryStatus } from '../entities/industry.entity';
import { ToBoolean } from 'src/utils/to-boolean';
import { BadRequestException } from '@nestjs/common';

export class GetAllIndustriesDto extends GetAllDto {
  @IsEnum(IndustryStatus)
  @IsOptional()
  status: IndustryStatus;

  @IsUUID()
  @IsString()
  @IsOptional()
  user_id: string;

  @ToBoolean()
  @IsOptional()
  @ValidateIf((o: GetAllIndustriesDto) => {
    if (o.only_include_mine && o.exclude_mine) {
      throw new BadRequestException(
        'Only include mind and exclude mine should not be used in a single call',
      );
    }
    return true;
  })
  exclude_mine: boolean;

  @ToBoolean()
  @IsOptional()
  only_include_mine: boolean;
}
