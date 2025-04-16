import { UserRole } from 'src/modules/users/entities/user.entity';
export declare class LogInDto {
    email: string;
    password: string;
    roles: UserRole[];
}
