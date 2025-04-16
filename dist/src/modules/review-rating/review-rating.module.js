"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRatingModule = void 0;
const common_1 = require("@nestjs/common");
const review_rating_service_1 = require("./review-rating.service");
const review_rating_controller_1 = require("./review-rating.controller");
const typeorm_1 = require("@nestjs/typeorm");
const review_rating_entity_1 = require("./entities/review-rating.entity");
const shared_module_1 = require("../../shared/shared.module");
const tender_entity_1 = require("../tender/entities/tender.entity");
const bid_entity_1 = require("../bid/entities/bid.entity");
let ReviewRatingModule = class ReviewRatingModule {
};
exports.ReviewRatingModule = ReviewRatingModule;
exports.ReviewRatingModule = ReviewRatingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([review_rating_entity_1.ReviewRating, tender_entity_1.Tender, bid_entity_1.Bid]),
            shared_module_1.SharedModule,
        ],
        controllers: [review_rating_controller_1.ReviewRatingController],
        providers: [review_rating_service_1.ReviewRatingService],
    })
], ReviewRatingModule);
//# sourceMappingURL=review-rating.module.js.map