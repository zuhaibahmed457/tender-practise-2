import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewRatingDto } from './create-review-rating.dto';

export class UpdateReviewRatingDto extends PartialType(CreateReviewRatingDto) {}
