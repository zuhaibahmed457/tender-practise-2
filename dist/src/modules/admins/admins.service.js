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
exports.AdminsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const users_service_1 = require("../users/users.service");
const tender_service_1 = require("../tender/tender.service");
const bid_service_1 = require("../bid/bid.service");
const earning_entity_1 = require("../earnings/entities/earning.entity");
const transaction_entity_1 = require("../transactions/entities/transaction.entity");
let AdminsService = class AdminsService {
    constructor(usersRepository, transactionRepository, earningRepository, userService, tenderService, bidService) {
        this.usersRepository = usersRepository;
        this.transactionRepository = transactionRepository;
        this.earningRepository = earningRepository;
        this.userService = userService;
        this.tenderService = tenderService;
        this.bidService = bidService;
    }
    async dashboard(currentUser) {
        const userCounts = await this.userService.userCounts(currentUser);
        const tendersCounts = await this.tenderService.getTenderStates(currentUser);
        const bidsCounts = await this.bidService.getBidCounts(currentUser);
        const earningFromBidders = await this.earningRepository
            .createQueryBuilder('earning')
            .select(['SUM(earning.platform_amount) as platform_amount'])
            .leftJoin('earning.bid', 'bid')
            .leftJoin('bid.bidder', 'bidder')
            .where('bidder.role = :role', { role: user_entity_1.UserRole.ORGANIZATION })
            .getRawOne();
        const earningFromTenderPoster = await this.transactionRepository
            .createQueryBuilder('transaction')
            .select(['SUM(transaction.platform_amount) as platform_amount'])
            .where('transaction.status = :success', {
            success: transaction_entity_1.TransactionStatus.SUCCESS,
        })
            .getRawOne();
        return {
            user_counts: userCounts,
            tender_counts: tendersCounts,
            bid_counts: bidsCounts,
            revenue: {
                from_bidders: parseFloat(earningFromBidders.platform_amount || 0),
                from_tender_poster: parseFloat(earningFromTenderPoster.platform_amount || 0),
                total: parseFloat(earningFromBidders.platform_amount || 0) +
                    parseFloat(earningFromTenderPoster.platform_amount || 0),
            },
        };
    }
    async getRevenue(currentUser, year) {
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
        const fromTenderPosterQuery = this.transactionRepository.createQueryBuilder('transactions')
            .select('EXTRACT(MONTH FROM transactions.created_at)::int', 'month')
            .addSelect('SUM(transactions.platform_amount)', 'fromPoster')
            .where('transactions.status = :status', {
            status: transaction_entity_1.TransactionStatus.SUCCESS,
        })
            .andWhere('EXTRACT(YEAR FROM transactions.created_at) = :year', { year })
            .groupBy('month');
        const fromBidderQuery = this.earningRepository.createQueryBuilder('earnings')
            .select('EXTRACT(MONTH FROM earnings.created_at)::int', 'month')
            .addSelect('SUM(earnings.platform_amount)', 'fromBidder')
            .where('earnings.status = :status', { status: earning_entity_1.EarningsStatus.PAID })
            .andWhere('EXTRACT(YEAR FROM earnings.created_at) = :year', { year })
            .groupBy('month');
        if (![user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.SUPER_ADMIN].includes(currentUser.role)) {
            fromTenderPosterQuery.andWhere('transactions.user = :userId', { userId: currentUser.id });
            fromBidderQuery.andWhere('earnings.user = :userId', { userId: currentUser.id });
        }
        const fromPoster = await fromTenderPosterQuery.getRawMany();
        const fromBidder = await fromBidderQuery.getRawMany();
        const monthlyData = months.map((monthName, index) => {
            const monthNumber = index + 1;
            const fromPosterData = fromPoster.find(s => parseInt(s.month) === monthNumber);
            const fromBidderData = fromBidder.find(e => parseInt(e.month) === monthNumber);
            return {
                month: monthName,
                from_poster: parseInt(fromPosterData?.fromPoster || '0'),
                from_bidder: parseInt(fromBidderData?.fromBidder || '0'),
            };
        });
        return monthlyData;
    }
};
exports.AdminsService = AdminsService;
exports.AdminsService = AdminsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(transaction_entity_1.Transaction)),
    __param(2, (0, typeorm_1.InjectRepository)(earning_entity_1.Earning)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        tender_service_1.TenderService,
        bid_service_1.BidService])
], AdminsService);
//# sourceMappingURL=admins.service.js.map