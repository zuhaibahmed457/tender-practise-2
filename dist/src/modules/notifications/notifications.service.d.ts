import { User } from '../users/entities/user.entity';
import { UserNotification } from './entities/user-notification.entity';
import { UserNotificationSetting } from './entities/user-notification-setting.entity';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { TransactionalNotificationPayload } from './interfaces/notification-payload.interface';
import { Queue } from 'bullmq';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class NotificationsService {
    private readonly userNotificationSettingRepository;
    private readonly userNotificationRepository;
    private readonly notificationRepository;
    private readonly transactionalNotificationQueue;
    constructor(userNotificationSettingRepository: Repository<UserNotificationSetting>, userNotificationRepository: Repository<UserNotification>, notificationRepository: Repository<Notification>, transactionalNotificationQueue: Queue);
    findAll(getAllDto: GetAllDto, currentUser: User): Promise<import("nestjs-typeorm-paginate").Pagination<UserNotification, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    unReadNotificationCount(currentUser: User): Promise<{
        total_unread_notifications: number;
    }>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<UserNotification>;
    readAllNotification(currentUser: User): Promise<void>;
    readNotification(paramIdDto: ParamIdDto, currentUser: User): Promise<UserNotification>;
    createUserNotificationSetting(currentUser: User): Promise<UserNotificationSetting>;
    createSendNotification(notificationPayload: TransactionalNotificationPayload): Promise<void>;
}
