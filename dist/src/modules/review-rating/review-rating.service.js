"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRatingService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const review_rating_entity_1 = require("./entities/review-rating.entity");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const tender_entity_1 = require("../tender/entities/tender.entity");
const bid_entity_1 = require("../bid/entities/bid.entity");
let ReviewRatingService = class ReviewRatingService {
    constructor(reviewRatingRepo, tenderRepo, userRepository, bidRepository) {
        this.reviewRatingRepo = reviewRatingRepo;
        this.tenderRepo = tenderRepo;
        this.userRepository = userRepository;
        this.bidRepository = bidRepository;
    }
    async addRating(createReviewRatingDto, currentUser) {
        if (currentUser?.id === createReviewRatingDto.given_to_id) {
            throw new common_1.ForbiddenException('you cannot perform this action on yourself');
        }
        const user = await this.userRepository.findOne({
            where: {
                id: createReviewRatingDto.given_to_id,
                status: user_entity_1.UserStatus.ACTIVE,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const tender = await this.tenderRepo.findOne({
            where: {
                id: createReviewRatingDto.tender_id,
                tender_status: (0, typeorm_2.In)([tender_entity_1.TenderStatus.DELIVERED, tender_entity_1.TenderStatus.RECEIVED]),
            },
            relations: {
                created_by: true,
            },
        });
        if (!tender)
            throw new common_1.NotFoundException('Tender not found');
        const acceptedBid = await this.bidRepository.findOne({
            where: {
                tender: {
                    id: createReviewRatingDto.tender_id,
                },
                status: bid_entity_1.BidStatus.ACCEPTED,
            },
            relations: {
                bidder: true,
            },
        });
        if (!acceptedBid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        if (!((tender.created_by.id === currentUser.id &&
            acceptedBid.bidder.id === user.id) ||
            (acceptedBid.bidder.id === currentUser.id &&
                tender.created_by.id === user.id))) {
            throw new common_1.ForbiddenException('You are not allowed to add rating for this tender');
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
            throw new common_1.ForbiddenException('You have already rated this tender');
        }
        const ratingReview = this.reviewRatingRepo.create({
            ...createReviewRatingDto,
            given_by: currentUser,
            given_to: user,
            tender,
        });
        const saveRatingReview = await ratingReview.save();
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
    async findAll(getAllReviewRatingDto, currentUser) {
        const { rating, user_id, page, per_page, search } = getAllReviewRatingDto;
        const query = this.reviewRatingRepo
            .createQueryBuilder('review_rating')
            .leftJoinAndSelect('review_rating.given_to', 'user')
            .leftJoinAndSelect('review_rating.given_by', 'rater')
            .leftJoinAndSelect('review_rating.tender', 'tender');
        if (user_id) {
            query.andWhere('user.id = :user_id', { user_id });
        }
        else {
            query.andWhere('user.id = :currentUserId', {
                currentUserId: currentUser.id,
            });
        }
        if (rating) {
            query.andWhere('review_rating.rating = :rating', { rating });
        }
        if (search) {
            query.andWhere("(user.first_name || ' ' || user.last_name ILIKE :search OR user.email ILIKE :search)", { search: `%${search}%` });
        }
        query.orderBy('review_rating.created_at', 'DESC');
        const paginationOption = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOption);
    }
    async findOne({ id }) {
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
            throw new common_1.NotFoundException('Review and Rating not found');
        return reviewRating;
    }
    async update({ id }, updateReviewRatingDto, currentUser) {
        const reviewRating = await this.findOne({ id });
        if (reviewRating.given_by.id !== currentUser.id) {
            throw new common_1.ForbiddenException(`can't perform this action`);
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
};
exports.ReviewRatingService = ReviewRatingService;
exports.ReviewRatingService = ReviewRatingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(review_rating_entity_1.ReviewRating)),
    __param(1, (0, typeorm_1.InjectRepository)(tender_entity_1.Tender)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ReviewRatingService);
//# sourceMappingURL=review-rating.service.js.map