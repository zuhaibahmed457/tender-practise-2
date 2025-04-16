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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const common_1 = require("@nestjs/common");
const earnings_service_1 = require("../earnings/earnings.service");
const transactions_service_1 = require("../transactions/transactions.service");
const bid_service_1 = require("../bid/bid.service");
const tender_service_1 = require("../tender/tender.service");
let OrganizationService = class OrganizationService {
    constructor(earningService, transactionService, bidService, tenderService) {
        this.earningService = earningService;
        this.transactionService = transactionService;
        this.bidService = bidService;
        this.tenderService = tenderService;
    }
    async getDashboardStats({ id: organization_id }, currentUser) {
        const totalEarnings = await this.earningService.getTotalEarnings(currentUser, organization_id);
        const totalSpending = await this.transactionService.getTotalSpending(currentUser, organization_id);
        const bids = await this.bidService.getBidCounts(currentUser, organization_id);
        const tenders = await this.tenderService.getTenderStates(currentUser, organization_id);
        return {
            ...totalEarnings,
            ...totalSpending,
            bids,
            tenders,
        };
    }
    async getTenderGraphStates(currentUser, getTendersGraphDto) {
        return await this.tenderService.getTenderGraphStates(currentUser, getTendersGraphDto);
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [earnings_service_1.EarningsService,
        transactions_service_1.TransactionsService,
        bid_service_1.BidService,
        tender_service_1.TenderService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map