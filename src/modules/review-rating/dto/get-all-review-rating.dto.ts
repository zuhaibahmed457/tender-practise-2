import { IsNumber, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';

export class GetAllReviewRatingDto extends GetAllDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsOptional()
  user_id: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  @IsOptional()
  rating: number;
}
