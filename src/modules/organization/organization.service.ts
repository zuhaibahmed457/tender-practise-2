import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { User } from '../users/entities/user.entity';
import { EarningsService } from '../earnings/earnings.service';
import { TransactionsService } from '../transactions/transactions.service';
import { BidService } from '../bid/bid.service';
import { TenderService } from '../tender/tender.service';
import { GetTendersGraphDto } from '../tender/dto/get-tenders-graph.dto';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly earningService: EarningsService,
    private readonly transactionService: TransactionsService,
    private readonly bidService: BidService,
    private readonly tenderService: TenderService,
  ) { }

  async getDashboardStats(
    { id: organization_id }: ParamIdDto,
    currentUser: User,
  ) {
    const totalEarnings = await this.earningService.getTotalEarnings(
      currentUser,
      organization_id,
    );

    const totalSpending = await this.transactionService.getTotalSpending(
      currentUser,
      organization_id,
    );

    const bids = await this.bidService.getBidCounts(
      currentUser,
      organization_id,
    );

    const tenders = await this.tenderService.getTenderStates(currentUser, organization_id);

    return {
      ...totalEarnings,
      ...totalSpending,
      bids,
      tenders,
    };
  }

  async getTenderGraphStates(currentUser: User,
    getTendersGraphDto: GetTendersGraphDto,) {
    return await this.tenderService.getTenderGraphStates(currentUser, getTendersGraphDto)
  }
}
