import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { AdminsService } from './admins.service';
export declare class AdminsController {
    private readonly adminsService;
    constructor(adminsService: AdminsService);
    dashboard(user: User): Promise<IResponse>;
    RevenueGraph(currentUser: User, year: number): Promise<IResponse>;
}
