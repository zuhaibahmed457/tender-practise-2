"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderPolicy = void 0;
const tender_entity_1 = require("../entities/tender.entity");
exports.TenderPolicy = {
    [tender_entity_1.TenderStatus.DRAFT]: [
        'title',
        'bid_deadline',
        'tender_budget_amount',
        'size_id',
        'quantity',
        'industry_ids',
        'transporter_required',
        'transportation_budget_amount',
        'pickup_address_id',
        'dropoff_address_id',
        'tender_image',
    ],
    [tender_entity_1.TenderStatus.PENDING_APPROVAL]: [
        'pickup_address_id',
        'dropoff_address_id',
        'transporter_required',
    ],
    [tender_entity_1.TenderStatus.APPROVED]: [
        'pickup_address_id',
        'dropoff_address_id',
        'transporter_required',
    ],
    [tender_entity_1.TenderStatus.REJECTED]: [],
};
//# sourceMappingURL=update-tender-policy.js.map