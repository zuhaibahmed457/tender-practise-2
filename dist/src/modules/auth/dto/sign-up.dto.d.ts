import { UserRole } from 'src/modules/users/entities/user.entity';
export declare class SignUpDto {
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    password: string;
    confirm_password: string;
}
