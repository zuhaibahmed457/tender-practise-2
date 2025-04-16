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
exports.ReviewRatingController = void 0;
const common_1 = require("@nestjs/common");
const review_rating_service_1 = require("./review-rating.service");
const create_review_rating_dto_1 = require("./dto/create-review-rating.dto");
const update_review_rating_dto_1 = require("./dto/update-review-rating.dto");
const authentication_guard_1 = require("../../shared/guards/authentication.guard");
const nestjs_form_data_1 = require("nestjs-form-data");
const current_user_decorator_1 = require("../../shared/decorators/current-user.decorator");
const user_entity_1 = require("../users/entities/user.entity");
const get_all_review_rating_dto_1 = require("./dto/get-all-review-rating.dto");
const paramId_dto_1 = require("../../shared/dtos/paramId.dto");
let ReviewRatingController = class ReviewRatingController {
    constructor(reviewRatingService) {
        this.reviewRatingService = reviewRatingService;
    }
    async addRating(createReviewRatingDto, currentUser) {
        const reviewRating = await this.reviewRatingService.addRating(createReviewRatingDto, currentUser);
        return {
            message: 'Review and Rating created successfully',
            details: reviewRating,
        };
    }
    async findAll(getAllReviewRatingDto, currentUser) {
        const { items, meta } = await this.reviewRatingService.findAll(getAllReviewRatingDto, currentUser);
        return {
            message: 'All Review and Rating fetch successfully',
            details: items,
            extra: meta,
        };
    }
    async findOne(paramIdDto) {
        const reviewRating = await this.reviewRatingService.findOne(paramIdDto);
        return {
            message: 'All Review and Rating fetch successfully',
            details: reviewRating,
        };
    }
    async update(paramIdDto, updateReviewRatingDto, currentUser) {
        const updateReviewRating = await this.reviewRatingService.update(paramIdDto, updateReviewRatingDto, currentUser);
        return {
            message: 'Review and Rating Update successfully',
            details: updateReviewRating,
        };
    }
};
exports.ReviewRatingController = ReviewRatingController;
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_review_rating_dto_1.CreateReviewRatingDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "addRating", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_review_rating_dto_1.GetAllReviewRatingDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(authentication_guard_1.AuthenticationGuard),
    (0, nestjs_form_data_1.FormDataRequest)(),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [paramId_dto_1.ParamIdDto,
        update_review_rating_dto_1.UpdateReviewRatingDto,
        user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ReviewRatingController.prototype, "update", null);
exports.ReviewRatingController = ReviewRatingController = __decorate([
    (0, common_1.Controller)('review-rating'),
    __metadata("design:paramtypes", [review_rating_service_1.ReviewRatingService])
], ReviewRatingController);
//# sourceMappingURL=review-rating.controller.js.map