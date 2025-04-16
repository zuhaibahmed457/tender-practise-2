"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllTendersPolicy = void 0;
const user_entity_1 = require("../../users/entities/user.entity");
const tender_entity_1 = require("../entities/tender.entity");
exports.GetAllTendersPolicy = {
    allowedFields: {
        [user_entity_1.UserRole.SUPER_ADMIN]: [
            'tender_status',
            'created_by_id',
            'industry_id',
            'size_id',
            'company_type_id',
            'location',
            'price_min',
            'price_max',
            'page',
            'per_page',
            'search',
            'exclude_archived',
            'organization_bidder_id',
            'exclude_expired',
            'start_date',
            'end_date'
        ],
        [user_entity_1.UserRole.ADMIN]: [
            'tender_status',
            'created_by_id',
            'industry_id',
            'size_id',
            'company_type_id',
            'location',
            'price_min',
            'price_max',
            'page',
            'per_page',
            'search',
            'exclude_archived',
            'organization_bidder_id',
            'exclude_expired',
            'start_date',
            'end_date'
        ],
        [user_entity_1.UserRole.ORGANIZATION]: [
            'tender_status',
            'created_by_id',
            'industry_id',
            'size_id',
            'company_type_id',
            'location',
            'price_min',
            'price_max',
            'page',
            'per_page',
            'search',
            'exclude_mine',
            'exclude_archived',
            'exclude_already_bidded',
            'organization_bidder_id',
            'exclude_expired',
            'start_date',
            'end_date'
        ],
        [user_entity_1.UserRole.TRANSPORTER]: [
            'tender_status',
            'created_by_id',
            'industry_id',
            'size_id',
            'company_type_id',
            'location',
            'price_min',
            'price_max',
            'page',
            'per_page',
            'search',
            'exclude_archived',
            'exclude_expired',
            'start_date',
            'end_date'
        ],
    },
    allowedValues: {
        tender_status: {
            [user_entity_1.UserRole.SUPER_ADMIN]: Object.values(tender_entity_1.TenderStatus),
            [user_entity_1.UserRole.ADMIN]: Object.values(tender_entity_1.TenderStatus),
            [user_entity_1.UserRole.ORGANIZATION]: [tender_entity_1.TenderStatus.APPROVED],
            [user_entity_1.UserRole.TRANSPORTER]: [tender_entity_1.TenderStatus.APPROVED],
        },
    },
};
//# sourceMappingURL=get-all-tenders.policy.js.map