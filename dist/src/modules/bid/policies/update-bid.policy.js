"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidPolicy = void 0;
const bid_entity_1 = require("../entities/bid.entity");
exports.BidPolicy = {
    [bid_entity_1.BidStatus.CREATED]: ['delivery_date', 'amount', 'priority'],
    [bid_entity_1.BidStatus.IN_TRANSACTION]: ['priority'],
    [bid_entity_1.BidStatus.ACCEPTED]: ['priority'],
};
//# sourceMappingURL=update-bid.policy.js.map