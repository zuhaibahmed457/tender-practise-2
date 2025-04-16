"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenderPolicyFactory = void 0;
const common_1 = require("@nestjs/common");
const update_tender_policy_1 = require("../policies/update-tender-policy");
class TenderPolicyFactory {
    static getAllowedFields(status) {
        return update_tender_policy_1.TenderPolicy[status];
    }
    static canUpdate(status, updateTenderDto) {
        const allowedFields = TenderPolicyFactory.getAllowedFields(status);
        return Object.keys(updateTenderDto).forEach((field) => {
            if (!allowedFields.includes(field)) {
                throw new common_1.BadRequestException(`Field ${field} is not allowed, when tender is in ${status}`);
            }
        });
    }
}
exports.TenderPolicyFactory = TenderPolicyFactory;
//# sourceMappingURL=update-tender.factory.js.map