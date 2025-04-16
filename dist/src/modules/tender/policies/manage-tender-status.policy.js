"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageTenderStatusPolicy = exports.TenderStatusCanBeUpdatedBy = void 0;
const tender_entity_1 = require("../entities/tender.entity");
var TenderStatusCanBeUpdatedBy;
(function (TenderStatusCanBeUpdatedBy) {
    TenderStatusCanBeUpdatedBy["ADMIN"] = "admin";
    TenderStatusCanBeUpdatedBy["SUPER_ADMIN"] = "super_admin";
    TenderStatusCanBeUpdatedBy["CREATOR_ORGANIZATION"] = "creator_organization";
    TenderStatusCanBeUpdatedBy["BIDDING_ORGANIZATION"] = "bidding_organization";
})(TenderStatusCanBeUpdatedBy || (exports.TenderStatusCanBeUpdatedBy = TenderStatusCanBeUpdatedBy = {}));
exports.ManageTenderStatusPolicy = {
    [TenderStatusCanBeUpdatedBy.SUPER_ADMIN]: {
        [tender_entity_1.TenderStatus.PENDING_APPROVAL]: [
            tender_entity_1.TenderStatus.APPROVED,
            tender_entity_1.TenderStatus.REJECTED,
        ],
        [tender_entity_1.TenderStatus.APPROVED]: [tender_entity_1.TenderStatus.IN_ACTIVE],
        [tender_entity_1.TenderStatus.IN_ACTIVE]: [tender_entity_1.TenderStatus.APPROVED],
    },
    [TenderStatusCanBeUpdatedBy.ADMIN]: {
        [tender_entity_1.TenderStatus.PENDING_APPROVAL]: [
            tender_entity_1.TenderStatus.APPROVED,
            tender_entity_1.TenderStatus.REJECTED,
        ],
        [tender_entity_1.TenderStatus.APPROVED]: [tender_entity_1.TenderStatus.IN_ACTIVE],
        [tender_entity_1.TenderStatus.IN_ACTIVE]: [tender_entity_1.TenderStatus.APPROVED],
    },
    [TenderStatusCanBeUpdatedBy.CREATOR_ORGANIZATION]: {
        [tender_entity_1.TenderStatus.DRAFT]: [tender_entity_1.TenderStatus.PENDING_APPROVAL],
        [tender_entity_1.TenderStatus.DELIVERED]: [tender_entity_1.TenderStatus.RECEIVED],
    },
    [TenderStatusCanBeUpdatedBy.BIDDING_ORGANIZATION]: {
        [tender_entity_1.TenderStatus.IN_PROGRESS]: [tender_entity_1.TenderStatus.DELIVERED],
    },
};
//# sourceMappingURL=manage-tender-status.policy.js.map