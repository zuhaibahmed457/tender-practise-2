import { SignUpDto } from 'src/modules/auth/dto/sign-up.dto';
import { UserRole } from '../entities/user.entity';
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<SignUpDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    role: UserRole;
    phone_no: string;
    country_id: string;
    company_type_id: string;
}
export {};
