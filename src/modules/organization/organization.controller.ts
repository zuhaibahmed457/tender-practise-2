import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GetTendersGraphDto } from '../tender/dto/get-tenders-graph.dto';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) { }

  @Get(':id/dashboard-stats')
  @UseGuards(AuthenticationGuard)
  async getDashboardStats(
    @Param() paramIdDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ) {
    const dashboardStats = await this.organizationService.getDashboardStats(
      paramIdDto,
      currentUser,
    );

    return {
      message: 'Dashboard stats fetched successfully',
      details: dashboardStats,
    };
  }

  @Get('tender-graph')
  @UseGuards(AuthenticationGuard)
  async getTenderGraphStates(
    @CurrentUser() currentUser: User,
    @Query() getTendersGraphDto: GetTendersGraphDto,
  ) {
    const graphData = await this.organizationService.getTenderGraphStates(currentUser, getTendersGraphDto);

    return {
      message: 'Graph data fetched successfully',
      details: graphData,
    };
  }

}
