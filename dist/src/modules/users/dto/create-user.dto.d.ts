import { UserRole } from '../entities/user.entity';
export declare class CreateUserDto {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    confirm_password: string;
    role: UserRole;
}
