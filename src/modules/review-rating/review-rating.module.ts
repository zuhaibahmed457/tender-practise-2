import { Module } from '@nestjs/common';
import { ReviewRatingService } from './review-rating.service';
import { ReviewRatingController } from './review-rating.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewRating } from './entities/review-rating.entity';
import { SharedModule } from 'src/shared/shared.module';
import { Tender } from '../tender/entities/tender.entity';
import { Bid } from '../bid/entities/bid.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReviewRating, Tender, Bid]),
    SharedModule,
  ],
  controllers: [ReviewRatingController],
  providers: [ReviewRatingService],
})
export class ReviewRatingModule {}
