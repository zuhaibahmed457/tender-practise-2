import { UserRole } from "src/modules/users/entities/user.entity";
export declare const ROLES_KEY = "rolesDecorator";
export declare const RolesDecorator: (...roles: UserRole[]) => import("@nestjs/common").CustomDecorator<string>;
