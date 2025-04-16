import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewRatingDto {
  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  given_to_id: string;

  @IsUUID('all', { message: 'Invalid id' })
  @IsNotEmpty()
  tender_id: string;

  @IsNumber()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  review: string;
}
