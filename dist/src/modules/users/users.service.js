"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("./entities/user.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const login_attempt_entity_1 = require("../auth/entities/login-attempt.entity");
const validation_exception_formatter_1 = require("../../utils/validation-exception-formatter");
const user_validation_1 = require("./validation/user-validation");
const user_get_one_validation_1 = require("./validation/user-get-one.validation");
const notifications_service_1 = require("../notifications/notifications.service");
const country_entity_1 = require("../country/entities/country.entity");
const company_type_entity_1 = require("../company-type/entities/company-type.entity");
const industry_entity_1 = require("../industry/entities/industry.entity");
const user_industries_entity_1 = require("./entities/user-industries.entity");
const media_service_1 = require("../media/media.service");
const user_s3_enum_1 = require("./enums/user-s3.enum");
const media_entity_1 = require("../media/entities/media.entity");
const stripe_1 = require("stripe");
let UsersService = class UsersService {
    constructor(usersRepository, countriesRepository, loginAttemptRepository, companyTypesRepository, industryRepository, userIndustriesRepository, mediaRepository, notificationsService, mediaService, stripe) {
        this.usersRepository = usersRepository;
        this.countriesRepository = countriesRepository;
        this.loginAttemptRepository = loginAttemptRepository;
        this.companyTypesRepository = companyTypesRepository;
        this.industryRepository = industryRepository;
        this.userIndustriesRepository = userIndustriesRepository;
        this.mediaRepository = mediaRepository;
        this.notificationsService = notificationsService;
        this.mediaService = mediaService;
        this.stripe = stripe;
    }
    async create(createUserDto, currentUser) {
        const isEmailExist = await this.usersRepository.findOne({
            where: {
                email: createUserDto.email,
            },
        });
        if (isEmailExist)
            throw new validation_exception_formatter_1.ValidationException({ email: 'Email is already exist' });
        if (createUserDto?.role === user_entity_1.UserRole.ADMIN &&
            currentUser.role != user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException(`you cant't create another admin`);
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
    async createConnectAccountLink(currentUser, createConnectAccountLink) {
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
    async uploadProfile(uploadProfileDto, currentUser) {
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            currentUser.id !== uploadProfileDto.user_id) {
            throw new common_1.ForbiddenException('You are not allowed to perform this action');
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
            throw new common_1.NotFoundException('User not found');
        }
        const payload = {
            file: uploadProfileDto.profile_image,
            folder_path: user_s3_enum_1.UserS3Paths.PROFILE_IMAGE,
        };
        const media = await this.mediaService.createMedia(user, payload);
        if (user.profile_image) {
            await this.mediaService.deleteMedia(user, { id: user.profile_image.id });
        }
        user.profile_image = media;
        return user.save();
    }
    async changePassword(currentUser, changePasswordDto) {
        const user = await this.usersRepository.findOne({
            where: { id: currentUser.id },
            select: ['password', 'id', 'role'],
        });
        if (!(await user.comparePassword(changePasswordDto.password))) {
            throw new validation_exception_formatter_1.ValidationException({ password: 'Invalid password' });
        }
        if (changePasswordDto.password === changePasswordDto.new_password) {
            throw new validation_exception_formatter_1.ValidationException({
                new_password: 'Old password & new password cannot be same.',
            });
        }
        user.password = changePasswordDto.new_password;
        await user.save();
    }
    async findAll(currentUser, getAllDto) {
        const { page, per_page, search, status, role, end_date, start_date } = getAllDto;
        const query = this.usersRepository
            .createQueryBuilder('users')
            .where('users.role != :excludeSuperAdmin AND users.deleted_at IS NULL', {
            excludeSuperAdmin: user_entity_1.UserRole.SUPER_ADMIN,
        })
            .orderBy('created_at', 'DESC');
        if (currentUser?.role === user_entity_1.UserRole.ADMIN) {
            query.andWhere('users.role != :excludeAdmin', {
                excludeAdmin: user_entity_1.UserRole.ADMIN,
            });
        }
        if (role) {
            query.andWhere('users.role = :role', { role: role });
        }
        if (search) {
            query.andWhere(`(users.first_name || ' '  || users.last_name ILIKE :search OR users.email ILIKE :search)`, { search: `%${search}%` });
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
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
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
        if (!user)
            throw new common_1.NotFoundException('Organization not found');
        (0, user_get_one_validation_1.validateOneUser)(currentUser, user);
        return user;
    }
    async update({ id }, updateUserDto, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        (0, user_validation_1.validateUser)(id, currentUser, updateUserDto, user);
        if (updateUserDto?.email) {
            const user = await this.usersRepository.findOne({
                where: {
                    email: updateUserDto.email,
                    id: (0, typeorm_2.Not)(id),
                },
            });
            if (user)
                throw new common_1.NotFoundException('this email already exist');
        }
        if (updateUserDto.country_id &&
            updateUserDto.country_id !== user?.country?.id) {
            const country = await this.countriesRepository.findOne({
                where: {
                    id: updateUserDto.country_id,
                },
            });
            if (!country)
                throw new common_1.NotFoundException('Country not found');
            user.country = country;
        }
        if (user.country &&
            typeof updateUserDto.country_id === 'string' &&
            updateUserDto.country_id.length < 1) {
            user.country = null;
        }
        if (updateUserDto.company_type_id &&
            updateUserDto.company_type_id !== user?.company_type?.id) {
            const companyType = await this.companyTypesRepository.findOne({
                where: {
                    id: updateUserDto.company_type_id,
                },
            });
            if (!companyType)
                throw new common_1.NotFoundException('Company Type not found');
            user.company_type = companyType;
        }
        if (user.company_type &&
            typeof updateUserDto.company_type_id === 'string' &&
            updateUserDto.company_type_id.length < 1) {
            user.company_type = null;
        }
        Object.assign(user, updateUserDto);
        return user.save();
    }
    async updateTimeZone(currentUser, updateTimeZoneDto) {
        const user = await this.usersRepository.findOne({
            where: {
                id: currentUser.id,
            },
        });
        Object.assign(user, updateTimeZoneDto);
        return await user.save();
    }
    async manageStatus({ id }, manageStatusDto, currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        if (user?.role === user_entity_1.UserRole.ADMIN && currentUser?.role === user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to update other admin's status");
        }
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException("You are not allowed to update super admin's status");
        }
        Object.assign(user, manageStatusDto);
        return user.save();
    }
    async remove(currentUser) {
        const user = await this.usersRepository.findOne({
            where: {
                id: currentUser.id,
                deleted_at: (0, typeorm_2.IsNull)(),
            },
        });
        if (user?.role === user_entity_1.UserRole.SUPER_ADMIN)
            throw new common_1.BadRequestException(`A Super Admin cannot delete their own account.`);
        user.deleted_at = new Date();
        await user.save();
    }
    async addDeviceToken(currentLoginAttempt, addDeviceTokenDto) {
        currentLoginAttempt.fcm_device_token = addDeviceTokenDto.device_token;
        await this.loginAttemptRepository.save(currentLoginAttempt);
    }
    async attachIndustryToUser(currentUser, userId, industryId) {
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            currentUser.id !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to do this');
        }
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const industry = await this.industryRepository.findOne({
            where: {
                id: industryId,
                status: industry_entity_1.IndustryStatus.ACTIVE,
            },
        });
        if (!industry) {
            throw new common_1.NotFoundException('Industry not found');
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
            throw new common_1.BadRequestException('Industry is already in the preference');
        }
        const userIndustry = this.userIndustriesRepository.create({
            user,
            industry,
        });
        return userIndustry.save();
    }
    async deleteIndustryFromUser(currentUser, userId, industryId) {
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            currentUser.id !== userId) {
            throw new common_1.ForbiddenException('You are not allowed to do this');
        }
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const industry = await this.industryRepository.findOne({
            where: {
                id: industryId,
            },
        });
        if (!industry) {
            throw new common_1.NotFoundException('Industry not found');
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
            throw new common_1.BadRequestException('Industry is not in the preference');
        }
        return this.userIndustriesRepository.remove(userIndustry);
    }
    async userCounts(currentUser) {
        const query = this.usersRepository
            .createQueryBuilder('user')
            .select([
            `SUM(CASE WHEN user.status = :active THEN 1 ELSE 0 END) as total_active`,
            `SUM(CASE WHEN user.status = :inactive THEN 1 ELSE 0 END) as total_inactive`,
            `SUM(CASE WHEN user.role = :org AND user.status = :active THEN 1 ELSE 0 END) as organization_active`,
            `SUM(CASE WHEN user.role = :org AND user.status = :inactive THEN 1 ELSE 0 END) as organization_inactive`,
            `SUM(CASE WHEN user.role = :transporter AND user.status = :active THEN 1 ELSE 0 END) as transporter_active`,
            `SUM(CASE WHEN user.role = :transporter AND user.status = :inactive THEN 1 ELSE 0 END) as transporter_inactive`,
            ...(currentUser.role === user_entity_1.UserRole.SUPER_ADMIN && [
                ` SUM(CASE WHEN user.role = :admin AND user.status = :active THEN 1 ELSE 0 END) as admin_active`,
                `SUM(CASE WHEN user.role = :admin AND user.status = :inactive THEN 1 ELSE 0 END) as admin_inactive`,
            ]),
        ])
            .setParameters({
            active: user_entity_1.UserStatus.ACTIVE,
            inactive: user_entity_1.UserStatus.INACTIVE,
            org: user_entity_1.UserRole.ORGANIZATION,
            transporter: user_entity_1.UserRole.TRANSPORTER,
            admin: user_entity_1.UserRole.ADMIN,
        });
        if (currentUser.role !== user_entity_1.UserRole.SUPER_ADMIN) {
            query.andWhere('user.role != :admin', { admin: user_entity_1.UserRole.ADMIN });
        }
        const result = await query.getRawOne();
        const response = {
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
            ...(currentUser.role === user_entity_1.UserRole.SUPER_ADMIN && {
                admin: {
                    active: Number(result.admin_active || 0),
                    inactive: Number(result.admin_inactive || 0),
                },
            }),
        };
        return response;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __param(2, (0, typeorm_1.InjectRepository)(login_attempt_entity_1.LoginAttempt)),
    __param(3, (0, typeorm_1.InjectRepository)(company_type_entity_1.CompanyType)),
    __param(4, (0, typeorm_1.InjectRepository)(industry_entity_1.Industry)),
    __param(5, (0, typeorm_1.InjectRepository)(user_industries_entity_1.UserIndustries)),
    __param(6, (0, typeorm_1.InjectRepository)(media_entity_1.Media)),
    __param(9, (0, common_1.Inject)('STRIPE_CLIENT')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        notifications_service_1.NotificationsService,
        media_service_1.MediaService,
        stripe_1.default])
], UsersService);
//# sourceMappingURL=users.service.js.map