import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReviewRatingService } from './review-rating.service';
import { CreateReviewRatingDto } from './dto/create-review-rating.dto';
import { UpdateReviewRatingDto } from './dto/update-review-rating.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { FormDataRequest } from 'nestjs-form-data';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllReviewRatingDto } from './dto/get-all-review-rating.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';

@Controller('review-rating')
export class ReviewRatingController {
  constructor(private readonly reviewRatingService: ReviewRatingService) {}

  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  @Post()
  async addRating(
    @Body() createReviewRatingDto: CreateReviewRatingDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const reviewRating = await this.reviewRatingService.addRating(
      createReviewRatingDto,
      currentUser,
    );
    return {
      message: 'Review and Rating created successfully',
      details: reviewRating,
    };
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  async findAll(
    @Query() getAllReviewRatingDto: GetAllReviewRatingDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.reviewRatingService.findAll(
      getAllReviewRatingDto,
      currentUser,
    );
    return {
      message: 'All Review and Rating fetch successfully',
      details: items,
      extra: meta,
    };
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const reviewRating = await this.reviewRatingService.findOne(paramIdDto);
    return {
      message: 'All Review and Rating fetch successfully',
      details: reviewRating,
    };
  }

  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  @Patch(':id')
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateReviewRatingDto: UpdateReviewRatingDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const updateReviewRating = await this.reviewRatingService.update(
      paramIdDto,
      updateReviewRatingDto,
      currentUser,
    );
    return {
      message: 'Review and Rating Update successfully',
      details: updateReviewRating,
    };
  }
}
