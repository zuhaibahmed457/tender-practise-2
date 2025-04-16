import { NotificationsService } from './notifications.service';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { User } from '../users/entities/user.entity';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(getAllDto: GetAllDto, currentUser: User): Promise<IResponse>;
    unReadNotificationCount(currentUser: User): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    readAllNotification(currentUser: User): Promise<IResponse>;
    readNotification(paramIdDto: ParamIdDto, currentUser: User): Promise<IResponse>;
}
