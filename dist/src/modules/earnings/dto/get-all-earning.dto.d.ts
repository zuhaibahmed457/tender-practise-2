import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { EarningsStatus } from '../entities/earning.entity';
import { UserRole } from 'src/modules/users/entities/user.entity';
export declare class GetAllEarningDto extends GetAllDto {
    status: EarningsStatus;
    organization_id: string;
    role: UserRole;
    start_date?: Date;
    end_date?: Date;
}
