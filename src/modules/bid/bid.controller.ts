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
import { BidService } from './bid.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { GetAllBidsDto } from './dto/get-all-bid.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetBidDashboardGraphDto } from './dto/get-bid-dashboard-graph.dto';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION)
  async create(
    @CurrentUser() currentUser: User,
    @Body() createBidDto: CreateBidDto,
  ): Promise<IResponse> {
    const bid = await this.bidService.create(currentUser, createBidDto);

    return {
      message: 'Bid created successfully',
      details: bid,
    };
  }

  @Get('dashboard/graph')
  @UseGuards(AuthenticationGuard)
  async getDashboardGraph(
    @CurrentUser() currentUser: User,
    @Query() getBidDashboardGraphDto: GetBidDashboardGraphDto,
  ) {
    const graph = await this.bidService.getBidGraphStats(
      currentUser,
      getBidDashboardGraphDto.year,
      getBidDashboardGraphDto.organization_id,
    );
    return {
      message: 'Graph fetched successfully',
      details: graph,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() getAllBidsDto: GetAllBidsDto,
  ) {
    const { items, meta } = await this.bidService.findAll(
      currentUser,
      getAllBidsDto,
    );

    return {
      message: 'Bids fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Patch(':id/accept')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ORGANIZATION, UserRole.TRANSPORTER)
  async acceptBid(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const bid = await this.bidService.acceptBid(paramIdDto, currentUser);
    return {
      message: 'Bid accepted successfully',
      details: bid,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ORGANIZATION)
  async findOne(
    @Param() paramIdDto: ParamIdDto,
    currentUser: User,
  ): Promise<IResponse> {
    const bid = await this.bidService.findOne(paramIdDto, currentUser);
    return {
      message: 'Bid found successfully',
      details: bid,
    };
  }

  @Patch(':id')
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ORGANIZATION)
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateBidDto: UpdateBidDto,
  ): Promise<IResponse> {
    const bid = await this.bidService.update(paramIdDto, updateBidDto);

    return {
      message: `Bid updated successfully`,
      details: bid,
    };
  }
}
