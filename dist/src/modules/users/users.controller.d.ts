import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from './entities/user.entity';
import { GetAllUserDto } from './dto/get-all-user-dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageStatusDto } from './dto/manage-status-dto';
import { AddDeviceTokenDto } from './dto/add-device-token.dto';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';
import { UploadProfileDto } from './dto/upload-profile.dto';
import { CreateConnectAccountLink } from './dto/create-connect-account-link.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto, currentUser: User): Promise<IResponse>;
    createConnectAccountLink(createConnectAccountLink: CreateConnectAccountLink, currentUser: User): Promise<{
        message: string;
        details: import("stripe").Stripe.Response<import("stripe").Stripe.AccountLink>;
    }>;
    uploadProfile(uploadProfileDto: UploadProfileDto, currentUser: User): Promise<IResponse>;
    updateTimeZone(currentUser: User, updateTimeZoneDto: UpdateTimeZoneDto): Promise<IResponse>;
    changePassword(currentUser: User, changePasswordDto: ChangePasswordDto): Promise<IResponse>;
    findAll(getAllDto: GetAllUserDto, user: User): Promise<IResponse>;
    findOne(paramDto: ParamIdDto, currentUser: User): Promise<IResponse>;
    update(paramDto: ParamIdDto, updateUserDto: UpdateUserDto, user: User): Promise<IResponse>;
    manage_status(paramDto: ParamIdDto, manageStatusDto: ManageStatusDto, user: User): Promise<IResponse>;
    remove(currentUser: User): Promise<void>;
    addDeviceToken(currentLoginAttempt: LoginAttempt, addDeviceTokenDto: AddDeviceTokenDto): Promise<IResponse>;
    attachIndustryToUser(userId: string, industryId: string, currentUser: User): Promise<{
        message: string;
        details: import("./entities/user-industries.entity").UserIndustries;
    }>;
    deleteIndustryFromUser(userId: string, industryId: string, currentUser: User): Promise<{
        message: string;
    }>;
}
