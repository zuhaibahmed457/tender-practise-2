import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole, UserStatus } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { GetAllUserDto } from './dto/get-all-user-dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { ManageStatusDto } from './dto/manage-status-dto';
import { AddDeviceTokenDto } from './dto/add-device-token.dto';
import { LoginAttempt } from '../auth/entities/login-attempt.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ValidationException } from 'src/utils/validation-exception-formatter';
import { ChangePasswordDto } from './dto/change-password.dto';
import { validateUser } from './validation/user-validation';
import { validateOneUser } from './validation/user-get-one.validation';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateTimeZoneDto } from './dto/update-time-zone.dto';
import { Country } from '../country/entities/country.entity';
import { CompanyType } from '../company-type/entities/company-type.entity';
import { Industry, IndustryStatus } from '../industry/entities/industry.entity';
import { UserIndustries } from './entities/user-industries.entity';
import { UploadProfileDto } from './dto/upload-profile.dto';
import { MediaService } from '../media/media.service';
import { UserS3Paths } from './enums/user-s3.enum';
import { Media } from '../media/entities/media.entity';
import Stripe from 'stripe';
import { CreateConnectAccountLink } from './dto/create-connect-account-link.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,

    @InjectRepository(LoginAttempt)
    private readonly loginAttemptRepository: Repository<LoginAttempt>,

    @InjectRepository(CompanyType)
    private readonly companyTypesRepository: Repository<CompanyType>,

    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,

    @InjectRepository(UserIndustries)
    private readonly userIndustriesRepository: Repository<UserIndustries>,

    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,

    private readonly notificationsService: NotificationsService,
    private readonly mediaService: MediaService,
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
  ) {}

  async create(createUserDto: CreateUserDto, currentUser: User) {
    const isEmailExist = await this.usersRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (isEmailExist)
      throw new ValidationException({ email: 'Email is already exist' });

    if (
      createUserDto?.role === UserRole.ADMIN &&
      currentUser.role != UserRole.SUPER_ADMIN
    ) {
      throw new ForbiddenException(`you cant't create another admin`);
    }

    const user = this.usersRepository.create({
      ...createUserDto,
    });

    const stripeCustomer = await this.stripe.customers.create({
      email: createUserDto.email,
      name: `${createUserDto.first_name} ${createUserDto.last_name}`,
    });

    await user.save();

    await this.notificationsService.createUserNotificationSetting(user);

    const { password, ...userData } = user;
    return userData;
  }

  async createConnectAccountLink(
    currentUser: User,
    createConnectAccountLink: CreateConnectAccountLink,
  ) {
    if (!currentUser.stripe_connect_account_id) {
      const stripeConnectAccount = await this.stripe.accounts.create({
        controller: {
          stripe_dashboard: {
            type: 'express',
          },
          fees: {
            payer: 'application',
          },
          losses: {
            payments: 'application',
          },
        },
        country: 'US',
        email: currentUser.email,
        settings: {
          payouts: {
            schedule: {
              interval: 'weekly',
              weekly_anchor: 'monday',
            },
          },
        },
      });

      currentUser.stripe_connect_account_id = stripeConnectAccount.id;

      await currentUser.save();
    }

    const accountLink = await this.stripe.accountLinks.create({
      account: currentUser.stripe_connect_account_id,
      refresh_url: createConnectAccountLink.refresh_url,
      return_url: createConnectAccountLink.return_url,
      type: 'account_onboarding',
    });

    return accountLink;
  }

  async uploadProfile(uploadProfileDto: UploadProfileDto, currentUser: User) {
    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      currentUser.id !== uploadProfileDto.user_id
    ) {
      throw new ForbiddenException(
        'You are not allowed to perform this action',
      );
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: uploadProfileDto.user_id,
      },
      relations: {
        profile_image: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload = {
      file: uploadProfileDto.profile_image,
      folder_path: UserS3Paths.PROFILE_IMAGE,
    };

    const media = await this.mediaService.createMedia(user, payload);

    if (user.profile_image) {
      await this.mediaService.deleteMedia(user, { id: user.profile_image.id });
    }

    user.profile_image = media;

    return user.save();
  }

  async changePassword(
    currentUser: User,
    changePasswordDto: ChangePasswordDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: { id: currentUser.id },
      select: ['password', 'id', 'role'],
    });

    if (!(await user.comparePassword(changePasswordDto.password))) {
      throw new ValidationException({ password: 'Invalid password' });
    }

    if (changePasswordDto.password === changePasswordDto.new_password) {
      throw new ValidationException({
        new_password: 'Old password & new password cannot be same.',
      });
    }

    user.password = changePasswordDto.new_password;

    await user.save();
  }

  async findAll(currentUser: User, getAllDto: GetAllUserDto) {
    const { page, per_page, search, status, role, end_date, start_date } =
      getAllDto;

    const query = this.usersRepository
      .createQueryBuilder('users')
      .where('users.role != :excludeSuperAdmin AND users.deleted_at IS NULL', {
        excludeSuperAdmin: UserRole.SUPER_ADMIN,
      })
      .orderBy('created_at', 'DESC');

    if (currentUser?.role === UserRole.ADMIN) {
      query.andWhere('users.role != :excludeAdmin', {
        excludeAdmin: UserRole.ADMIN,
      });
    }

    if (role) {
      query.andWhere('users.role = :role', { role: role });
    }

    if (search) {
      query.andWhere(
        `(users.first_name || ' '  || users.last_name ILIKE :search OR users.email ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    if (status) {
      query.andWhere('users.status = :status', { status });
    }

    if (start_date) {
      query.andWhere('users.created_at >= :start_date', { start_date });
    }

    if (end_date) {
      query.andWhere('users.created_at <= :end_date', { end_date });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<User>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile_image: true,
        banner_image: true,
        country: true,
        company_type: true,
      },
    });

    if (!user) throw new NotFoundException('Organization not found');

    validateOneUser(currentUser, user);

    return user;
  }

  async update(
    { id }: ParamIdDto,
    updateUserDto: UpdateUserDto,
    currentUser: User,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    validateUser(id, currentUser, updateUserDto, user);

    if (updateUserDto?.email) {
      const user = await this.usersRepository.findOne({
        where: {
          email: updateUserDto.email,
          id: Not(id),
        },
      });

      if (user) throw new NotFoundException('this email already exist');
    }

    if (
      updateUserDto.country_id &&
      updateUserDto.country_id !== user?.country?.id
    ) {
      const country = await this.countriesRepository.findOne({
        where: {
          id: updateUserDto.country_id,
        },
      });

      if (!country) throw new NotFoundException('Country not found');

      user.country = country;
    }

    if (
      user.country &&
      typeof updateUserDto.country_id === 'string' &&
      updateUserDto.country_id.length < 1
    ) {
      user.country = null;
    }

    if (
      updateUserDto.company_type_id &&
      updateUserDto.company_type_id !== user?.company_type?.id
    ) {
      const companyType = await this.companyTypesRepository.findOne({
        where: {
          id: updateUserDto.company_type_id,
        },
      });

      if (!companyType) throw new NotFoundException('Company Type not found');

      user.company_type = companyType;
    }

    if (
      user.company_type &&
      typeof updateUserDto.company_type_id === 'string' &&
      updateUserDto.company_type_id.length < 1
    ) {
      user.company_type = null;
    }

    Object.assign(user, updateUserDto);

    return user.save();
  }

  async updateTimeZone(
    currentUser: User,
    updateTimeZoneDto: UpdateTimeZoneDto,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id: currentUser.id,
      },
    });

    Object.assign(user, updateTimeZoneDto);
    return await user.save();
  }

  async manageStatus(
    { id }: ParamIdDto,
    manageStatusDto: ManageStatusDto,
    currentUser: User,
  ) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user?.role === UserRole.ADMIN && currentUser?.role === UserRole.ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to update other admin's status",
      );
    }

    if (user?.role === UserRole.SUPER_ADMIN) {
      throw new ForbiddenException(
        "You are not allowed to update super admin's status",
      );
    }

    Object.assign(user, manageStatusDto);

    return user.save();
  }

  async remove(currentUser: User) {
    const user = await this.usersRepository.findOne({
      where: {
        id: currentUser.id,
        deleted_at: IsNull(),
      },
    });

    if (user?.role === UserRole.SUPER_ADMIN)
      throw new BadRequestException(
        `A Super Admin cannot delete their own account.`,
      );

    user.deleted_at = new Date();
    await user.save();
  }

  async addDeviceToken(
    currentLoginAttempt: LoginAttempt,
    addDeviceTokenDto: AddDeviceTokenDto,
  ) {
    currentLoginAttempt.fcm_device_token = addDeviceTokenDto.device_token;
    await this.loginAttemptRepository.save(currentLoginAttempt);
  }

  async attachIndustryToUser(
    currentUser: User,
    userId: string,
    industryId: string,
  ) {
    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      currentUser.id !== userId
    ) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const industry = await this.industryRepository.findOne({
      where: {
        id: industryId,
        status: IndustryStatus.ACTIVE,
      },
    });

    if (!industry) {
      throw new NotFoundException('Industry not found');
    }

    const userIndustryExists = await this.userIndustriesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        industry: {
          id: industryId,
        },
      },
    });

    if (userIndustryExists) {
      throw new BadRequestException('Industry is already in the preference');
    }

    const userIndustry = this.userIndustriesRepository.create({
      user,
      industry,
    });

    return userIndustry.save();
  }

  async deleteIndustryFromUser(
    currentUser: User,
    userId: string,
    industryId: string,
  ) {
    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      currentUser.id !== userId
    ) {
      throw new ForbiddenException('You are not allowed to do this');
    }

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const industry = await this.industryRepository.findOne({
      where: {
        id: industryId,
      },
    });

    if (!industry) {
      throw new NotFoundException('Industry not found');
    }

    const userIndustry = await this.userIndustriesRepository.findOne({
      where: {
        user: {
          id: userId,
        },
        industry: {
          id: industryId,
        },
      },
    });

    if (!userIndustry) {
      throw new BadRequestException('Industry is not in the preference');
    }

    return this.userIndustriesRepository.remove(userIndustry);
  }

  async userCounts(currentUser: User) {
    const query = this.usersRepository
      .createQueryBuilder('user')
      .select([
        // Total
        `SUM(CASE WHEN user.status = :active THEN 1 ELSE 0 END) as total_active`,
        `SUM(CASE WHEN user.status = :inactive THEN 1 ELSE 0 END) as total_inactive`,

        // Organization
        `SUM(CASE WHEN user.role = :org AND user.status = :active THEN 1 ELSE 0 END) as organization_active`,
        `SUM(CASE WHEN user.role = :org AND user.status = :inactive THEN 1 ELSE 0 END) as organization_inactive`,

        // Transporter
        `SUM(CASE WHEN user.role = :transporter AND user.status = :active THEN 1 ELSE 0 END) as transporter_active`,
        `SUM(CASE WHEN user.role = :transporter AND user.status = :inactive THEN 1 ELSE 0 END) as transporter_inactive`,

        // Admin (only shown if current user is super_admin)
        ...(currentUser.role === UserRole.SUPER_ADMIN ? [
          `SUM(CASE WHEN user.role = :admin AND user.status = :active THEN 1 ELSE 0 END) as admin_active`,
          `SUM(CASE WHEN user.role = :admin AND user.status = :inactive THEN 1 ELSE 0 END) as admin_inactive`
        ] : []),
      ])
      .setParameters({
        active: UserStatus.ACTIVE,
        inactive: UserStatus.INACTIVE,
        org: UserRole.ORGANIZATION,
        transporter: UserRole.TRANSPORTER,
        admin: UserRole.ADMIN,
      });

    if (currentUser.role !== UserRole.SUPER_ADMIN) {
      query.andWhere('user.role != :admin', { admin: UserRole.ADMIN });
    }

    const result = await query.getRawOne();

    const response: any = {
      total: {
        active: Number(result.total_active || 0),
        inactive: Number(result.total_inactive || 0),
      },
      organization: {
        active: Number(result.organization_active || 0),
        inactive: Number(result.organization_inactive || 0),
      },
      transporter: {
        active: Number(result.transporter_active || 0),
        inactive: Number(result.transporter_inactive || 0),
      },
      ...(currentUser.role === UserRole.SUPER_ADMIN && {
        admin: {
          active: Number(result.admin_active || 0),
          inactive: Number(result.admin_inactive || 0),
        },
      }),
    };

    return response;
  }
}
