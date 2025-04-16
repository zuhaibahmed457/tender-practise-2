import { Test, TestingModule } from '@nestjs/testing';
import { ReviewRatingController } from './review-rating.controller';
import { ReviewRatingService } from './review-rating.service';

describe('ReviewRatingController', () => {
  let controller: ReviewRatingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewRatingController],
      providers: [ReviewRatingService],
    }).compile();

    controller = module.get<ReviewRatingController>(ReviewRatingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
