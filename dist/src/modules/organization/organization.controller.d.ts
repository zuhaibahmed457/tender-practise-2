import { OrganizationService } from './organization.service';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { User } from '../users/entities/user.entity';
import { GetTendersGraphDto } from '../tender/dto/get-tenders-graph.dto';
export declare class OrganizationController {
    private readonly organizationService;
    constructor(organizationService: OrganizationService);
    getDashboardStats(paramIdDto: ParamIdDto, currentUser: User): Promise<{
        message: string;
        details: {
            bids: {
                total: number;
                accepted: number;
                in_transaction: number;
                created: number;
            };
            tenders: any;
            total_spending: number;
            total_earned: number;
        };
    }>;
    getTenderGraphStates(currentUser: User, getTendersGraphDto: GetTendersGraphDto): Promise<{
        message: string;
        details: {
            month: string;
            spending: number;
            earning: number;
        }[];
    }>;
}
