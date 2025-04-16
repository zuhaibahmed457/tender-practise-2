"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStripeIntegrationDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_stripe_integration_dto_1 = require("./create-stripe-integration.dto");
class UpdateStripeIntegrationDto extends (0, mapped_types_1.PartialType)(create_stripe_integration_dto_1.CreateStripeIntegrationDto) {
}
exports.UpdateStripeIntegrationDto = UpdateStripeIntegrationDto;
//# sourceMappingURL=update-stripe-integration.dto.js.map