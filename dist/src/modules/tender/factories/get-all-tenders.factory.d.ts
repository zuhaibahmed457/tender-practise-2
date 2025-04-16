import { UserRole } from 'src/modules/users/entities/user.entity';
import { GetAllTendersDto } from '../dto/get-all-tenders.dto';
export declare class GetAllTendersFactory {
    static getAllowedFields(role: UserRole): string[];
    static getAllowedValues(role: UserRole, field: string): string[];
    static canFilterByField(role: UserRole, field: string): boolean;
    static canFilter(role: UserRole, getAllTendersDto: GetAllTendersDto, isOwner?: boolean): void;
}
