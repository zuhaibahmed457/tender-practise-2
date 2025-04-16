"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewRatingDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_review_rating_dto_1 = require("./create-review-rating.dto");
class UpdateReviewRatingDto extends (0, mapped_types_1.PartialType)(create_review_rating_dto_1.CreateReviewRatingDto) {
}
exports.UpdateReviewRatingDto = UpdateReviewRatingDto;
//# sourceMappingURL=update-review-rating.dto.js.map