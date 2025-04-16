import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { TransactionStatus } from '../entities/transaction.entity';
import { UserRole } from 'src/modules/users/entities/user.entity';
export declare class GetAllTransactionDto extends GetAllDto {
    status: TransactionStatus;
    organization_id: string;
    role: UserRole;
    price_min?: number;
    price_max?: number;
    start_date?: Date;
    end_date?: Date;
}
