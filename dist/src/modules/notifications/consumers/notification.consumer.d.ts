import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { EmailNotificationService } from '../services/email-notification.service';
import { InAppNotificationService } from '../services/in-app-notification.service';
import { UserNotification } from '../entities/user-notification.entity';
import { UserNotificationSetting } from '../entities/user-notification-setting.entity';
import { PushNotificationService } from '../services/push-notification.service';
export declare class NotificationConsumer extends WorkerHost {
    private readonly emailNotificationService;
    private readonly inAppNotificationService;
    private readonly pushNotificationService;
    private readonly userNotificationRepository;
    private readonly userNotificationSettingRepository;
    private readonly logger;
    constructor(emailNotificationService: EmailNotificationService, inAppNotificationService: InAppNotificationService, pushNotificationService: PushNotificationService, userNotificationRepository: Repository<UserNotification>, userNotificationSettingRepository: Repository<UserNotificationSetting>);
    process(job: Job): Promise<void>;
    private getUserNotification;
    private getAllowedChannels;
    private isChannelEnabled;
    private sendNotifications;
    private handleJobError;
    onJobFailed(job: Job, error: Error): Promise<void>;
}
