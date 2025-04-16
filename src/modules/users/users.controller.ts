import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { User, UserRole } from './entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { GetAllUserDto } from './dto/get-all-user-dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageStatusDto } from './dto/manage-status-dto';
import { textCapitalize } from 'src/utils/text-capitalize';
import { CurrentLoginAttempt } from 'src/shared/decorators/current-login-attempt.decorator';
import { AddDeviceTokenDto } from './dto/add-device-token.dto';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FormDataRequest } from 'nestjs-form-data';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';
import { UploadProfileDto } from './dto/upload-profile.dto';
import { CreateConnectAccountLink } from './dto/create-connect-account-link.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @FormDataRequest()
  async create(
    @Body() createUserDto: CreateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const user = await this.usersService.create(createUserDto, currentUser);

    return {
      message: 'User created successfully',
      details: user,
    };
  }

  @Post('create-connect-account-link')
  @UseGuards(AuthenticationGuard)
  async createConnectAccountLink(
    @Body() createConnectAccountLink: CreateConnectAccountLink,
    @CurrentUser() currentUser: User,
  ) {
    const link = await this.usersService.createConnectAccountLink(
      currentUser,
      createConnectAccountLink,
    );
    return {
      message: 'Redirecting to stripe connect',
      details: link,
    };
  }

  @Post('upload/profile-picture')
  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  async uploadProfile(
    @Body() uploadProfileDto: UploadProfileDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const user = await this.usersService.uploadProfile(
      uploadProfileDto,
      currentUser,
    );
    return {
      message: 'Profile picture uploaded successfully',
      details: user,
    };
  }

  @Patch('update/timezone')
  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  async updateTimeZone(
    @CurrentUser() currentUser: User,
    @Body() updateTimeZoneDto: UpdateTimeZoneDto,
  ): Promise<IResponse> {
    await this.usersService.updateTimeZone(currentUser, updateTimeZoneDto);
    return {
      message: 'Timezone updated succesfully',
    };
  }

  @Patch('change-password')
  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  async changePassword(
    @CurrentUser() currentUser: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<IResponse> {
    await this.usersService.changePassword(currentUser, changePasswordDto);
    return {
      message: 'Password changed successfully',
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async findAll(
    @Query() getAllDto: GetAllUserDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.usersService.findAll(user, getAllDto);
    return {
      message: 'Users fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.ORGANIZATION)
  async findOne(
    @Param() paramDto: ParamIdDto,
    @CurrentUser() currentUser: User,
  ): Promise<IResponse> {
    const user = await this.usersService.findOne(paramDto, currentUser);
    return {
      message: 'User fetched successfully',
      details: user,
    };
  }

  @Patch('update/:id')
  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  async update(
    @Param() paramDto: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedUser = await this.usersService.update(
      paramDto,
      updateUserDto,
      user,
    );
    return {
      message: `Profile updated successfully`,
      details: updatedUser,
    };
  }

  @Patch('manage-status/:id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  async manage_status(
    @Param() paramDto: ParamIdDto,
    @Body() manageStatusDto: ManageStatusDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedUser = await this.usersService.manageStatus(
      paramDto,
      manageStatusDto,
      user,
    );
    return {
      message: `${textCapitalize(manageStatusDto.status)} successfully`,
      details: updatedUser,
    };
  }

  @Delete('delete')
  @UseGuards(AuthenticationGuard)
  remove(@CurrentUser() currentUser: User) {
    return this.usersService.remove(currentUser);
  }

  @Post('add-device-token')
  @UseGuards(AuthenticationGuard)
  @FormDataRequest()
  async addDeviceToken(
    @CurrentLoginAttempt() currentLoginAttempt: LoginAttempt,
    @Body() addDeviceTokenDto: AddDeviceTokenDto,
  ): Promise<IResponse> {
    await this.usersService.addDeviceToken(
      currentLoginAttempt,
      addDeviceTokenDto,
    );
    return {
      message: 'Device token saved successfully',
    };
  }

  @Post(':user_id/industry/:industry_id')
  @UseGuards(AuthenticationGuard)
  async attachIndustryToUser(
    @Param('user_id') userId: string,
    @Param('industry_id') industryId: string,
    @CurrentUser() currentUser: User,
  ) {
    const preference = await this.usersService.attachIndustryToUser(
      currentUser,
      userId,
      industryId,
    );
    return {
      message: 'Industry added to your preference',
      details: preference,
    };
  }

  @Delete(':user_id/industry/:industry_id')
  @UseGuards(AuthenticationGuard)
  async deleteIndustryFromUser(
    @Param('user_id') userId: string,
    @Param('industry_id') industryId: string,
    @CurrentUser() currentUser: User,
  ) {
    await this.usersService.deleteIndustryFromUser(
      currentUser,
      userId,
      industryId,
    );

    return {
      message: 'Industry deleted from your preference',
    };
  }

}
