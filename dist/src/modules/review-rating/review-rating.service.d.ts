import { CreateReviewRatingDto } from './dto/create-review-rating.dto';
import { ReviewRating } from './entities/review-rating.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GetAllReviewRatingDto } from './dto/get-all-review-rating.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { UpdateReviewRatingDto } from './dto/update-review-rating.dto';
import { Tender } from '../tender/entities/tender.entity';
import { Bid } from '../bid/entities/bid.entity';
export declare class ReviewRatingService {
    private reviewRatingRepo;
    private tenderRepo;
    private readonly userRepository;
    private readonly bidRepository;
    constructor(reviewRatingRepo: Repository<ReviewRating>, tenderRepo: Repository<Tender>, userRepository: Repository<User>, bidRepository: Repository<Bid>);
    addRating(createReviewRatingDto: CreateReviewRatingDto, currentUser: User): Promise<ReviewRating>;
    findAll(getAllReviewRatingDto: GetAllReviewRatingDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<ReviewRating, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<ReviewRating>;
    update({ id }: ParamIdDto, updateReviewRatingDto: UpdateReviewRatingDto, currentUser: User): Promise<ReviewRating>;
}
