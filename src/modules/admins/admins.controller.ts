import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) { }

  @Get('dashboard/stats')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async dashboard(@CurrentUser() user: User): Promise<IResponse> {
    const data = await this.adminsService.dashboard(user);
    return {
      message: 'Dashboard fetched successfully',
      details: data,
    };
  }

  @Get('platform-revenue-graph/:year')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async RevenueGraph(@CurrentUser() currentUser: User, @Param("year") year: number): Promise<IResponse> {
    const data = await this.adminsService.getRevenue(currentUser, year);
    return {
      message: 'Revenue fetched successfully',
      details: data,
    };
  }


}
