"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllBidsFactory = void 0;
const common_1 = require("@nestjs/common");
const get_all_bids_policy_1 = require("../policies/get-all-bids.policy");
class GetAllBidsFactory {
    static getAllowedFields(role) {
        return get_all_bids_policy_1.GetAllBidsPolicy.allowedFields[role];
    }
    static getAllowedValues(role, field) {
        return get_all_bids_policy_1.GetAllBidsPolicy.allowedValues[field]?.[role];
    }
    static canFilterByField(role, field) {
        return this.getAllowedFields(role).includes(field);
    }
    static canFilter(role, getAllBidderDto, isOwner = false) {
        Object.keys(getAllBidderDto).forEach((field) => {
            if (!this.canFilterByField(role, field)) {
                throw new common_1.BadRequestException(`You don't have permission to filter by ${field}`);
            }
            const allowedValues = this.getAllowedValues(role, field);
            if (allowedValues &&
                !allowedValues.includes(getAllBidderDto[field]) &&
                !isOwner) {
                throw new common_1.BadRequestException(`${field} is only allowed to filter by ${allowedValues}`);
            }
        });
    }
}
exports.GetAllBidsFactory = GetAllBidsFactory;
//# sourceMappingURL=get-all-bids.factory.js.map