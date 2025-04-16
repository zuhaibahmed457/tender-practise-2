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
exports.TenderService = void 0;
const common_1 = require("@nestjs/common");
const tender_entity_1 = require("./entities/tender.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const industry_entity_1 = require("../industry/entities/industry.entity");
const size_entity_1 = require("../sizes/entities/size.entity");
const address_entity_1 = require("../address/entities/address.entity");
const update_tender_factory_1 = require("./factories/update-tender.factory");
const get_all_tenders_factory_1 = require("./factories/get-all-tenders.factory");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const s3_service_1 = require("../../shared/services/s3.service");
const media_service_1 = require("../media/media.service");
const manage_tender_status_factory_1 = require("./factories/manage-tender-status.factory");
const manage_tender_status_policy_1 = require("./policies/manage-tender-status.policy");
const tender_s3_enum_1 = require("./enums/tender-s3.enum");
const bid_entity_1 = require("../bid/entities/bid.entity");
const event_emitter_1 = require("@nestjs/event-emitter");
const email_template_enum_1 = require("../notifications/enums/email-template.enum");
const dayjs = require("dayjs");
const notification_entity_1 = require("../notifications/entities/notification.entity");
const config_1 = require("@nestjs/config");
const earnings_service_1 = require("../earnings/earnings.service");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
const earning_entity_1 = require("../earnings/entities/earning.entity");
let TenderService = class TenderService {
    constructor(tenderRepository, industryRepository, sizeRepository, addressRepository, bidRepository, userRepository, transactionRepository, earningRepository, s3Service, mediaService, eventEmitter, configService, earningService) {
        this.tenderRepository = tenderRepository;
        this.industryRepository = industryRepository;
        this.sizeRepository = sizeRepository;
        this.addressRepository = addressRepository;
        this.bidRepository = bidRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
        this.earningRepository = earningRepository;
        this.s3Service = s3Service;
        this.mediaService = mediaService;
        this.eventEmitter = eventEmitter;
        this.configService = configService;
        this.earningService = earningService;
    }
    async create(currentUser, createTenderDto) {
        const { industry_ids, size_id, pickup_address_id, dropoff_address_id, tender_image, ...rest } = createTenderDto;
        const industries = await this.industryRepository.find({
            where: { id: (0, typeorm_2.In)(industry_ids), status: industry_entity_1.IndustryStatus.ACTIVE },
        });
        if (industries.length < 1) {
            throw new common_1.BadRequestException('Please select at least one valid industry');
        }
        const size = await this.sizeRepository.findOne({
            where: { id: size_id, status: size_entity_1.SizeStatus.ACTIVE },
        });
        if (!size) {
            throw new common_1.BadRequestException('Size not found');
        }
        const tender = this.tenderRepository.create({
            ...rest,
            created_by: currentUser,
            tender_status: tender_entity_1.TenderStatus.DRAFT,
            industries,
            size,
        });
        if (createTenderDto.tender_image) {
            tender.tender_image = await this.mediaService.createMedia(currentUser, {
                file: createTenderDto.tender_image,
                folder_path: tender_s3_enum_1.TenderS3Paths.TENDER_IMAGE,
            });
        }
        if (pickup_address_id) {
            const pickupAddress = await this.addressRepository.findOne({
                where: { id: pickup_address_id, created_by: { id: currentUser.id } },
            });
            if (!pickupAddress) {
                throw new common_1.BadRequestException('Pickup address not found');
            }
            tender.pickup_address = pickupAddress;
        }
        if (dropoff_address_id) {
            const dropoffAddress = await this.addressRepository.findOne({
                where: { id: dropoff_address_id, created_by: { id: currentUser.id } },
            });
            if (!dropoffAddress) {
                throw new common_1.BadRequestException('Dropoff address not found');
            }
            tender.dropoff_address = dropoffAddress;
        }
        return tender.save();
    }
    async findAll(currentUser, getAllTendersDto) {
        const { page, per_page, search, tender_status, created_by_id, industry_id, size_id, company_type_id, location, price_min, price_max, exclude_mine, exclude_archived, exclude_already_bidded, organization_bidder_id, exclude_expired, end_date, start_date, } = getAllTendersDto;
        get_all_tenders_factory_1.GetAllTendersFactory.canFilter(currentUser.role, getAllTendersDto, currentUser.id === created_by_id);
        const query = this.tenderRepository
            .createQueryBuilder('tender')
            .leftJoinAndSelect('tender.created_by', 'created_by')
            .leftJoinAndSelect('created_by.company_type', 'company_type')
            .leftJoinAndSelect('tender.size', 'size')
            .leftJoinAndSelect('tender.industries', 'industries')
            .leftJoinAndSelect('tender.pickup_address', 'pickup_address')
            .leftJoinAndSelect('tender.dropoff_address', 'dropoff_address')
            .leftJoinAndSelect('tender.medias', 'medias')
            .leftJoinAndSelect('tender.tender_image', 'tender_image')
            .leftJoin('tender.bids', 'bids');
        if (exclude_already_bidded && organization_bidder_id) {
            query
                .andWhere((qb) => {
                const subQuery = qb
                    .subQuery()
                    .select('1')
                    .from('bid', 'b')
                    .where('b.tender_id = tender.id')
                    .andWhere('b.bidder_id = :organization_bidder_id')
                    .getQuery();
                return `NOT EXISTS (${subQuery})`;
            })
                .setParameter('organization_bidder_id', organization_bidder_id);
        }
        if (exclude_expired) {
            query.andWhere('tender.bid_deadline > :current_date', {
                current_date: new Date(),
            });
        }
        if (price_min) {
            query.andWhere('tender.tender_budget_amount >= :price_min', {
                price_min,
            });
        }
        if (price_max) {
            query.andWhere('tender.tender_budget_amount <= :price_max', {
                price_max,
            });
        }
        if (location) {
            query.andWhere('dropoff_address.country ILIKE :location', {
                location: `%${location}%`,
            });
        }
        if (industry_id) {
            query.andWhere('industries.id = :industry_id', { industry_id });
        }
        if (size_id) {
            query.andWhere('size.id = :size_id', { size_id });
        }
        if (company_type_id) {
            query.andWhere('created_by.company_type_id = :company_type_id', {
                company_type_id,
            });
        }
        if (search) {
            query.andWhere('tender.title ILIKE :search', { search: `%${search}%` });
        }
        if (tender_status) {
            query.andWhere('tender.tender_status = :tender_status', {
                tender_status,
            });
        }
        if (!exclude_mine && created_by_id) {
            query.andWhere('tender.created_by_id = :created_by_id', {
                created_by_id,
            });
        }
        if (exclude_mine && created_by_id) {
            query.andWhere('tender.created_by_id != :created_by_id', {
                created_by_id,
            });
        }
        if (exclude_archived) {
            query.andWhere('tender.is_archived != :is_archived', {
                is_archived: true,
            });
        }
        if (start_date) {
            query.andWhere('tender.created_at >= :start_date', { start_date });
        }
        if (end_date) {
            query.andWhere('tender.created_at <= :end_date', { end_date });
        }
        query
            .distinctOn(['tender.created_at'])
            .addOrderBy('tender.created_at', 'DESC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne(currentUser, { id }) {
        const tender = await this.tenderRepository.findOne({
            where: { id },
            relations: [
                'created_by',
                'size',
                'industries',
                'pickup_address',
                'dropoff_address',
                'medias',
                'created_by',
            ],
        });
        if (!tender) {
            throw new common_1.NotFoundException('Tender not found');
        }
        const bid = await this.bidRepository.findOne({
            where: { tender: { id: tender.id }, bidder: { id: currentUser.id } },
        });
        return { ...tender, bid };
    }
    async update({ id }, currentUser, updateTenderDto) {
        const tender = await this.tenderRepository.findOne({
            where: { id, created_by: { id: currentUser.id } },
        });
        if (!tender) {
            throw new common_1.NotFoundException('Tender not found');
        }
        update_tender_factory_1.TenderPolicyFactory.canUpdate(tender.tender_status, updateTenderDto);
        const { industry_ids, size_id, pickup_address_id, dropoff_address_id, tender_image, ...rest } = updateTenderDto;
        Object.assign(tender, rest);
        if (industry_ids) {
            const industries = await this.industryRepository.find({
                where: { id: (0, typeorm_2.In)(industry_ids), status: industry_entity_1.IndustryStatus.ACTIVE },
            });
            if (industries.length < 1) {
                throw new common_1.BadRequestException('Please select at least one valid industry');
            }
            tender.industries = industries;
        }
        if (size_id) {
            const size = await this.sizeRepository.findOne({
                where: { id: size_id, status: size_entity_1.SizeStatus.ACTIVE },
            });
            if (!size) {
                throw new common_1.BadRequestException('Size not found');
            }
            tender.size = size;
        }
        if (pickup_address_id) {
            const pickupAddress = await this.addressRepository.findOne({
                where: { id: pickup_address_id, created_by: { id: currentUser.id } },
            });
            if (!pickupAddress) {
                throw new common_1.BadRequestException('Pickup address not found');
            }
            tender.pickup_address = pickupAddress;
        }
        if (updateTenderDto.tender_image) {
            if (tender.tender_image)
                await this.mediaService.deleteMedia(currentUser, {
                    id: tender.tender_image.id,
                });
            tender.tender_image = await this.mediaService.createMedia(currentUser, {
                file: updateTenderDto.tender_image,
                folder_path: tender_s3_enum_1.TenderS3Paths.TENDER_IMAGE,
            });
        }
        if (dropoff_address_id) {
            const dropoffAddress = await this.addressRepository.findOne({
                where: { id: dropoff_address_id, created_by: { id: currentUser.id } },
            });
            if (!dropoffAddress) {
                throw new common_1.BadRequestException('Dropoff address not found');
            }
            tender.dropoff_address = dropoffAddress;
        }
        return tender.save();
    }
    async createAttachment(currentUser, tender_id, createAttachmentDto) {
        const tender = await this.tenderRepository.findOne({
            where: {
                id: tender_id,
                tender_status: tender_entity_1.TenderStatus.DRAFT,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        if (!tender) {
            throw new common_1.BadRequestException('Attachment can only be attached when the tender is in draft state');
        }
        const url = await this.s3Service.uploadFile(createAttachmentDto.file, 'tender');
        const attachment = await this.mediaService.createMedia(currentUser, {
            file: createAttachmentDto.file,
            folder_path: 'tender',
        });
        attachment.tender = tender;
        return attachment.save();
    }
    async deleteAttachment(currentUser, tender_id, attachment_id) {
        const tender = await this.tenderRepository.findOne({
            where: {
                id: tender_id,
                tender_status: tender_entity_1.TenderStatus.DRAFT,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        if (!tender) {
            throw new common_1.BadRequestException('Attachment can only be deleted when the tender is in draft state');
        }
        return await this.mediaService.deleteMedia(currentUser, {
            id: attachment_id,
        });
    }
    async manageStatus(currentUser, { id }, manageStatusDto) {
        const tender = await this.tenderRepository.findOne({
            where: {
                id: id,
            },
            relations: {
                created_by: true,
            },
        });
        if (!tender) {
            throw new common_1.NotFoundException('Tender not found');
        }
        const bid = await this.bidRepository.findOne({
            where: {
                tender: {
                    id: tender.id,
                },
                bidder: {
                    id: currentUser.id,
                },
                status: bid_entity_1.BidStatus.ACCEPTED,
            },
        });
        let userRole;
        if ([user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN].includes(currentUser.role)) {
            userRole = currentUser.role;
        }
        else if (tender.created_by.id === currentUser.id) {
            userRole = manage_tender_status_policy_1.TenderStatusCanBeUpdatedBy.CREATOR_ORGANIZATION;
        }
        else if (bid) {
            userRole = manage_tender_status_policy_1.TenderStatusCanBeUpdatedBy.BIDDING_ORGANIZATION;
        }
        manage_tender_status_factory_1.ManageTenderStatusPolicyFactory.canUpdateStatus(tender.tender_status, manageStatusDto.tender_status, userRole);
        tender.tender_status = manageStatusDto.tender_status;
        await tender.save();
        if (manageStatusDto.tender_status === tender_entity_1.TenderStatus.PENDING_APPROVAL) {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.role IN (:...roles)', {
                roles: [user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN],
            })
                .andWhere('user.deleted_at IS NULL')
                .getMany();
            await this.sendNotificationToAdmin(users, tender);
        }
        if ([
            tender_entity_1.TenderStatus.APPROVED,
            tender_entity_1.TenderStatus.REJECTED,
            tender_entity_1.TenderStatus.IN_ACTIVE,
        ].includes(manageStatusDto.tender_status)) {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .where('user.role IN (:...roles)', {
                roles: [user_entity_1.UserRole.SUPER_ADMIN, user_entity_1.UserRole.ADMIN],
            })
                .andWhere('user.deleted_at IS NULL')
                .andWhere('user.id != :userId', { userId: currentUser.id })
                .getMany();
            await this.sendNotificationToAdminsWhenTenderApprovedOrRejectOrInActice(users, tender, currentUser);
        }
        if (manageStatusDto.tender_status === tender_entity_1.TenderStatus.RECEIVED) {
            const bid = await this.bidRepository.findOne({
                where: {
                    tender: {
                        id: tender.id,
                        created_by: { id: currentUser.id },
                    },
                    status: bid_entity_1.BidStatus.ACCEPTED,
                },
                relations: {
                    bidder: true,
                },
            });
            if (!bid) {
                throw new common_1.NotFoundException('Bid not found');
            }
            const transaction = await this.transactionRepository.findOne({
                where: {
                    bid: {
                        id: bid.id,
                    },
                },
            });
            if (!transaction) {
                throw new common_1.NotFoundException('Transaction not found');
            }
            await this.earningService.createBidTransfer(transaction.id);
            await this.sendNotificationToBidderWhenTenderReceived(bid, tender, currentUser);
        }
        if (![tender_entity_1.TenderStatus.IN_TRANSACTION, tender_entity_1.TenderStatus.IN_PROGRESS].includes(manageStatusDto.tender_status)) {
            await this.tenderStatusChangeNotificationToOrganization(tender, currentUser);
        }
        return tender;
    }
    async findBidWithNonCreatedStatus(currentUser, { id }) {
        const bid = await this.bidRepository.findOne({
            where: {
                status: (0, typeorm_2.In)([bid_entity_1.BidStatus.IN_TRANSACTION, bid_entity_1.BidStatus.ACCEPTED]),
                tender: {
                    id: id,
                    created_by: {
                        id: currentUser.id,
                    },
                },
            },
            relations: {
                bidder: true,
                tender: {
                    created_by: true,
                },
            },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        return bid;
    }
    remove(id) {
        return `This action removes a #${id} tender`;
    }
    async getTenderStates(currentUser, organization_id, year) {
        if (organization_id &&
            ![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser.role) &&
            organization_id !== currentUser.id) {
            throw new common_1.ForbiddenException('You are not allowed to access this resource');
        }
        const allStatuses = Object.values(tender_entity_1.TenderStatus);
        const tenders = this.tenderRepository
            .createQueryBuilder('tenders')
            .select([
            ...allStatuses.map((status) => `COUNT(CASE WHEN tenders.tender_status = '${status}' THEN 1 ELSE null END) as ${status}`),
            'COUNT(*) as total_count',
        ]);
        if (organization_id) {
            tenders.andWhere('tenders.created_by_id = :organization_id', {
                organization_id,
            });
        }
        if (year) {
            tenders.andWhere('EXTRACT(YEAR FROM tenders.created_at) = :year', {
                year,
            });
        }
        return await tenders.getRawOne();
    }
    async getTenderGraphStates(currentUser, getTendersGraphDto) {
        const { organization_id, year } = getTendersGraphDto;
        if (organization_id &&
            ![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser.role) &&
            organization_id !== currentUser.id) {
            throw new common_1.ForbiddenException('You are not allowed to access this resource');
        }
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'June',
            'July',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        const spendingQuery = this.transactionRepository.createQueryBuilder('transactions')
            .select('EXTRACT(MONTH FROM transactions.created_at)::int', 'month')
            .addSelect('SUM(transactions.total_amount_charged)', 'spending')
            .where('transactions.status = :status', {
            status: transaction_entity_1.TransactionStatus.SUCCESS,
        })
            .andWhere('EXTRACT(YEAR FROM transactions.created_at) = :year', { year })
            .groupBy('month');
        const earningsQuery = this.earningRepository.createQueryBuilder('earnings')
            .select('EXTRACT(MONTH FROM earnings.created_at)::int', 'month')
            .addSelect('SUM(earnings.total_earned)', 'earnings')
            .where('earnings.status = :status', { status: earning_entity_1.EarningsStatus.PAID })
            .andWhere('EXTRACT(YEAR FROM earnings.created_at) = :year', { year })
            .groupBy('month');
        if (![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser.role)) {
            spendingQuery.andWhere('transactions.user = :userId', { userId: currentUser.id });
            earningsQuery.andWhere('earnings.user = :userId', { userId: currentUser.id });
        }
        const spending = await spendingQuery.getRawMany();
        const earnings = await earningsQuery.getRawMany();
        const monthlyData = months.map((monthName, index) => {
            const monthNumber = index + 1;
            const spendingData = spending.find(s => parseInt(s.month) === monthNumber);
            const earningData = earnings.find(e => parseInt(e.month) === monthNumber);
            return {
                month: monthName,
                spending: parseInt(spendingData?.spending || '0'),
                earning: parseInt(earningData?.earnings || '0'),
            };
        });
        return monthlyData;
    }
    async sendNotificationToAdmin(users, tender) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: users.map((item) => item.id),
            title: 'New Tender Submission',
            message: 'A new tender has been submitted. Please review and approve it.',
            template: email_template_enum_1.EmailTemplate.NEW_TENDER_POSTED,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.TENDER,
            entity_id: tender.id,
            meta_data: {
                organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
                tender_title: tender.title,
                submission_date: dayjs(tender.created_at).format('MMMM D, YYYY'),
                approval_link: `${this.configService.get('FRONTEND_URL')}/admin/tenders/${tender.id}`,
            },
        });
    }
    async sendNotificationToAdminsWhenTenderApprovedOrRejectOrInActice(users, tender, currentUser) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: users.map((item) => item.id),
            title: `Tender ${tender.tender_status.toUpperCase()} by ${currentUser.first_name} ${currentUser.last_name}`,
            message: `The tender "${tender.title}" has been ${tender.tender_status} by ${currentUser.first_name} ${currentUser.last_name}.`,
            template: email_template_enum_1.EmailTemplate.TENDER_STATUS_UPDATED_FOR_ADMINS,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.TENDER,
            entity_id: tender.id,
            meta_data: {
                organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
                tender_title: tender.title,
                action_taken_by: `${currentUser.first_name} ${currentUser.last_name}`,
                tender_status: tender.tender_status.toUpperCase(),
                status_class: tender.tender_status === 'approved' ? 'approved' : 'rejected',
                action_date: dayjs().format('MMMM D, YYYY'),
                approval_link: `${this.configService.get('FRONTEND_URL')}/admin/tenders/${tender.id}`,
            },
        });
    }
    async sendNotificationToBidderWhenTenderReceived(bid, tender, currentUser) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [tender.created_by.id],
            title: 'Tender Marked as Received',
            message: `The tender titled "${tender.title}" has been marked as received by ${currentUser.first_name} ${currentUser.last_name}.`,
            template: email_template_enum_1.EmailTemplate.TENDER_RECEIVED_NOTIFICATION,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.BID,
            entity_id: bid.id,
            meta_data: {
                organization_name: `${bid.bidder.first_name} ${bid.bidder.last_name}`,
                tender_title: tender.title,
                posted_by: `${currentUser.first_name} ${currentUser.last_name}`,
                tender_url: `${this.configService.get('FRONTEND_URL')}/organization/tenders/${tender.id}`,
            },
        });
    }
    async tenderStatusChangeNotificationToOrganization(tender, currentUser) {
        this.eventEmitter.emitAsync('create-send-notification', {
            user_ids: [tender.created_by.id],
            title: 'Tender Approval Update',
            message: `Your tender "${tender.title}" has been ${tender.tender_status}.`,
            template: email_template_enum_1.EmailTemplate.TENDER_APPROVAL,
            notification_type: notification_entity_1.NotificationType.TRANSACTION,
            is_displayable: true,
            channels: [notification_entity_1.NotificationChannel.EMAIL, notification_entity_1.NotificationChannel.PUSH],
            bypass_user_preferences: true,
            entity_type: notification_entity_1.NotificationEntityType.TENDER,
            entity_id: tender.id,
            meta_data: {
                organization_name: `${tender.created_by.first_name} ${tender.created_by.last_name}`,
                tender_title: tender.title,
                tender_status: tender.tender_status,
                tender_status_label: tender.tender_status.toUpperCase(),
                delivered_by: `${currentUser.first_name} ${currentUser.last_name}`,
                tender_url: `${this.configService.get('FRONTEND_URL')}/organization/tenders/${tender.id}`,
            },
        });
    }
};
exports.TenderService = TenderService;
exports.TenderService = TenderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(tender_entity_1.Tender)),
    __param(1, (0, typeorm_1.InjectRepository)(industry_entity_1.Industry)),
    __param(2, (0, typeorm_1.InjectRepository)(size_entity_1.Size)),
    __param(3, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __param(4, (0, typeorm_1.InjectRepository)(bid_entity_1.Bid)),
    __param(5, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(6, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(7, (0, typeorm_1.InjectRepository)(earning_entity_1.Earning)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        s3_service_1.S3Service,
        media_service_1.MediaService,
        event_emitter_1.EventEmitter2,
        config_1.ConfigService,
        earnings_service_1.EarningsService])
], TenderService);
//# sourceMappingURL=tender.service.js.map