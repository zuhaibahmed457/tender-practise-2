import { ReviewRatingService } from './review-rating.service';
import { CreateReviewRatingDto } from './dto/create-review-rating.dto';
import { UpdateReviewRatingDto } from './dto/update-review-rating.dto';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllReviewRatingDto } from './dto/get-all-review-rating.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class ReviewRatingController {
    private readonly reviewRatingService;
    constructor(reviewRatingService: ReviewRatingService);
    addRating(createReviewRatingDto: CreateReviewRatingDto, currentUser: User): Promise<IResponse>;
    findAll(getAllReviewRatingDto: GetAllReviewRatingDto, currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updateReviewRatingDto: UpdateReviewRatingDto, currentUser: User): Promise<IResponse>;
}
