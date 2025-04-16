import { PartialType } from '@nestjs/mapped-types';
import { CreateBidDto } from './create-bid.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBidDto extends PartialType(CreateBidDto) {
    @IsNumber()
    @IsOptional()
    priority: number
}
