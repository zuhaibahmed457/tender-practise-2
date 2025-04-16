import { UserNotification } from '../entities/user-notification.entity';
import { RealTimeGateway } from 'src/shared/gateway/real-time.gateway';
export declare class InAppNotificationService {
    private readonly realTimeGateway;
    constructor(realTimeGateway: RealTimeGateway);
    sendNotification(userNotification: UserNotification, payload: any): Promise<void>;
}
