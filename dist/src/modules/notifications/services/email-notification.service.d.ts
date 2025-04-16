import { UserNotification } from '../entities/user-notification.entity';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
export declare class EmailNotificationService {
    private readonly configService;
    private readonly mailerService;
    private backendUrl;
    private companyName;
    constructor(configService: ConfigService, mailerService: MailerService);
    sendNotification(userNotification: UserNotification, payload: any): Promise<void>;
}
