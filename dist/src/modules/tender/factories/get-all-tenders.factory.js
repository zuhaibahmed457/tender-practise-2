"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAllTendersFactory = void 0;
const common_1 = require("@nestjs/common");
const get_all_tenders_policy_1 = require("../policies/get-all-tenders.policy");
class GetAllTendersFactory {
    static getAllowedFields(role) {
        return get_all_tenders_policy_1.GetAllTendersPolicy.allowedFields[role];
    }
    static getAllowedValues(role, field) {
        return get_all_tenders_policy_1.GetAllTendersPolicy.allowedValues[field]?.[role];
    }
    static canFilterByField(role, field) {
        return this.getAllowedFields(role).includes(field);
    }
    static canFilter(role, getAllTendersDto, isOwner = false) {
        Object.keys(getAllTendersDto).forEach((field) => {
            if (!this.canFilterByField(role, field)) {
                throw new common_1.BadRequestException(`You don't have permission to filter by ${field}`);
            }
            const allowedValues = this.getAllowedValues(role, field);
            if (allowedValues &&
                !allowedValues.includes(getAllTendersDto[field]) &&
                !isOwner) {
                throw new common_1.BadRequestException(`${field} is only allowed to filter by ${allowedValues}`);
            }
        });
    }
}
exports.GetAllTendersFactory = GetAllTendersFactory;
//# sourceMappingURL=get-all-tenders.factory.js.map