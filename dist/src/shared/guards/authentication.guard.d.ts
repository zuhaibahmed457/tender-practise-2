import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
export declare class AuthenticationGuard implements CanActivate {
    private loginAttemptsRepository;
    private usersRepository;
    constructor(loginAttemptsRepository: Repository<LoginAttempt>, usersRepository: Repository<User>);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
}
