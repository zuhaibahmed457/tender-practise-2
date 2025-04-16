"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageTenderStatusPolicyFactory = void 0;
const common_1 = require("@nestjs/common");
const manage_tender_status_policy_1 = require("../policies/manage-tender-status.policy");
class ManageTenderStatusPolicyFactory {
    static canUpdateStatus(currentStatus, newStatus, role) {
        const allowedTransitions = manage_tender_status_policy_1.ManageTenderStatusPolicy[role];
        if (!allowedTransitions) {
            throw new common_1.BadRequestException(`Invalid role: ${role}`);
        }
        if (!allowedTransitions[currentStatus]?.includes(newStatus)) {
            throw new common_1.BadRequestException(`Cannot change tender status from ${currentStatus} to ${newStatus}`);
        }
    }
}
exports.ManageTenderStatusPolicyFactory = ManageTenderStatusPolicyFactory;
//# sourceMappingURL=manage-tender-status.factory.js.map