"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidPolicyFactory = void 0;
const common_1 = require("@nestjs/common");
const update_bid_policy_1 = require("../policies/update-bid.policy");
class BidPolicyFactory {
    static getAllowedFields(status) {
        return update_bid_policy_1.BidPolicy[status];
    }
    static canUpdate(status, updateTenderDto) {
        const allowedFields = BidPolicyFactory.getAllowedFields(status);
        return Object.keys(updateTenderDto).forEach((field) => {
            if (!allowedFields.includes(field)) {
                throw new common_1.BadRequestException(`Field ${field} is not allowed, when tender is in ${status}`);
            }
        });
    }
}
exports.BidPolicyFactory = BidPolicyFactory;
//# sourceMappingURL=update-bid.factory.js.map