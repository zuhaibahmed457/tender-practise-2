"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePlatformFeeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_platform_fee_dto_1 = require("./create-platform-fee.dto");
class UpdatePlatformFeeDto extends (0, mapped_types_1.PartialType)(create_platform_fee_dto_1.CreatePlatformFeeDto) {
}
exports.UpdatePlatformFeeDto = UpdatePlatformFeeDto;
//# sourceMappingURL=update-platform-fee.dto.js.map