import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { UserRole, UserStatus } from '../entities/user.entity';
export declare class GetAllUserDto extends GetAllDto {
    role: UserRole;
    status: UserStatus;
    start_date?: Date;
    end_date?: Date;
}
