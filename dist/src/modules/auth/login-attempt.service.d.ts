import { Repository } from 'typeorm';
import { LoginAttempt, LoginType } from './entities/login-attempt.entity';
import { Request } from 'express';
import { User } from '../users/entities/user.entity';
export declare class LoginAttemptService {
    private readonly loginAttemptsRepository;
    constructor(loginAttemptsRepository: Repository<LoginAttempt>);
    createLoginAttempt(req: Request, user: User, accessToken: string, loginType?: LoginType): Promise<LoginAttempt>;
}
