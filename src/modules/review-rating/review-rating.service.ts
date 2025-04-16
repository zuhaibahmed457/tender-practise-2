import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReviewRatingDto } from './dto/create-review-rating.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ReviewRating } from './entities/review-rating.entity';
import { In, IsNull, Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { GetAllReviewRatingDto } from './dto/get-all-review-rating.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { UpdateReviewRatingDto } from './dto/update-review-rating.dto';
import { Tender, TenderStatus } from '../tender/entities/tender.entity';
import { Bid, BidStatus } from '../bid/entities/bid.entity';

@Injectable()
export class ReviewRatingService {
  constructor(
    @InjectRepository(ReviewRating)
    private reviewRatingRepo: Repository<ReviewRating>,
    @InjectRepository(Tender)
    private tenderRepo: Repository<Tender>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Bid)
    private readonly bidRepository: Repository<Bid>,
  ) {}

  async addRating(
    createReviewRatingDto: CreateReviewRatingDto,
    currentUser: User,
  ) {
    if (currentUser?.id === createReviewRatingDto.given_to_id) {
      throw new ForbiddenException(
        'you cannot perform this action on yourself',
      );
    }

    // This is the user who is being rated (receiver of the review)
    const user = await this.userRepository.findOne({
      where: {
        id: createReviewRatingDto.given_to_id,
        status: UserStatus.ACTIVE,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const tender = await this.tenderRepo.findOne({
      where: {
        id: createReviewRatingDto.tender_id,
        tender_status: In([TenderStatus.DELIVERED, TenderStatus.RECEIVED]),
      },
      relations: {
        created_by: true,
      },
    });

    if (!tender) throw new NotFoundException('Tender not found');

    const acceptedBid = await this.bidRepository.findOne({
      where: {
        tender: {
          id: createReviewRatingDto.tender_id,
        },
        status: BidStatus.ACCEPTED,
      },
      relations: {
        bidder: true,
      },
    });

    if (!acceptedBid) {
      throw new NotFoundException('Bid not found');
    }

    if (
      !(
        (tender.created_by.id === currentUser.id &&
          acceptedBid.bidder.id === user.id) ||
        (acceptedBid.bidder.id === currentUser.id &&
          tender.created_by.id === user.id)
      )
    ) {
      throw new ForbiddenException(
        'You are not allowed to add rating for this tender',
      );
    }

    const isReviewRatingAlreadyExist = await this.reviewRatingRepo.findOne({
      where: {
        given_by: {
          id: currentUser.id,
        },
        given_to: {
          id: user.id,
        },
        tender: {
          id: tender.id,
        },
      },
      relations: {
        given_by: true,
        given_to: true,
        tender: true,
      },
    });

    if (isReviewRatingAlreadyExist) {
      throw new ForbiddenException('You have already rated this tender');
    }

    const ratingReview = this.reviewRatingRepo.create({
      ...createReviewRatingDto,
      given_by: currentUser,
      given_to: user,
      tender,
    });

    const saveRatingReview = await ratingReview.save();

    // Update the average rating
    const { avgRating } = await this.reviewRatingRepo
      .createQueryBuilder('rating')
      .select('AVG(rating)', 'avgRating')
      .where('rating.given_to = :userId', { userId: user.id })
      .getRawOne();

    user.average_rating = parseFloat(avgRating);
    user.no_of_ratings += 1;
    await user.save();

    return saveRatingReview;
  }

  async findAll(
    getAllReviewRatingDto: GetAllReviewRatingDto,
    currentUser: User,
  ) {
    const { rating, user_id, page, per_page, search } = getAllReviewRatingDto;

    const query = this.reviewRatingRepo
      .createQueryBuilder('review_rating')
      .leftJoinAndSelect('review_rating.given_to', 'user')
      .leftJoinAndSelect('review_rating.given_by', 'rater')
      .leftJoinAndSelect('review_rating.tender', 'tender');

    if (user_id) {
      query.andWhere('user.id = :user_id', { user_id });
    } else {
      query.andWhere('user.id = :currentUserId', {
        currentUserId: currentUser.id,
      });
    }

    if (rating) {
      query.andWhere('review_rating.rating = :rating', { rating });
    }

    if (search) {
      query.andWhere(
        "(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search)",
        { search: `%${search}%` },
      );
    }

    query.orderBy('review_rating.created_at', 'DESC');

    const paginationOption: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate<ReviewRating>(query, paginationOption);
  }

  async findOne({ id }: ParamIdDto) {
    const reviewRating = await this.reviewRatingRepo.findOne({
      where: {
        id,
      },
      relations: {
        given_to: true,
        given_by: true,
        tender: true,
      },
    });

    if (!reviewRating)
      throw new NotFoundException('Review and Rating not found');

    return reviewRating;
  }

  async update(
    { id }: ParamIdDto,
    updateReviewRatingDto: UpdateReviewRatingDto,
    currentUser: User,
  ) {
    const reviewRating = await this.findOne({ id });

    if (reviewRating.given_by.id !== currentUser.id) {
      throw new ForbiddenException(`can't perform this action`);
    }
    const { given_to_id, tender_id, ...restBody } = updateReviewRatingDto;

    Object.assign(reviewRating, restBody);
    await reviewRating.save();

    const user = await this.userRepository.findOne({
      where: {
        id: reviewRating.given_to.id,
      },
    });

    const { avgRating } = await this.reviewRatingRepo
      .createQueryBuilder('rating')
      .select('AVG(rating)', 'avgRating')
      .where('rating.given_to = :userId', { userId: reviewRating.given_to.id })
      .getRawOne();

    user.average_rating = parseFloat(avgRating);
    await user.save();

    return await this.findOne({ id });
  }
}
