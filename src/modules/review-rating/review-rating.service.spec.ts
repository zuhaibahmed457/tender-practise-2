import { Test, TestingModule } from '@nestjs/testing';
import { ReviewRatingService } from './review-rating.service';

describe('ReviewRatingService', () => {
  let service: ReviewRatingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewRatingService],
    }).compile();

    service = module.get<ReviewRatingService>(ReviewRatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
