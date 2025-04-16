import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { EarningsService } from './earnings.service';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GetAllEarningDto } from './dto/get-all-earning.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';

@Controller('earnings')
export class EarningsController {
  constructor(private readonly earningsService: EarningsService) { }

  @Get()
  @UseGuards(AuthenticationGuard)
  async findAll(
    @Query() getAllEarningDto: GetAllEarningDto, @CurrentUser() CurrentUser: User): Promise<IResponse> {
    const { items, meta } = await this.earningsService.findAll(getAllEarningDto, CurrentUser)

    return {
      message: "All Earning fetch successfully",
      details: items,
      extra: meta
    }
  }
}
