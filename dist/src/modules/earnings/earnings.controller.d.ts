import { EarningsService } from './earnings.service';
import { User } from '../users/entities/user.entity';
import { GetAllEarningDto } from './dto/get-all-earning.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
export declare class EarningsController {
    private readonly earningsService;
    constructor(earningsService: EarningsService);
    findAll(getAllEarningDto: GetAllEarningDto, CurrentUser: User): Promise<IResponse>;
}
