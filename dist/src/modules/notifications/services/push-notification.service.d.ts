import { UserNotification } from '../entities/user-notification.entity';
import { LoginAttempt } from 'src/modules/auth/entities/login-attempt.entity';
import { Repository } from 'typeorm';
export declare class PushNotificationService {
    private readonly loginAttemptRepository;
    constructor(loginAttemptRepository: Repository<LoginAttempt>);
    sendNotification(userNotification: UserNotification, payload: any): Promise<void>;
}
