"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTenderDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_tender_dto_1 = require("./create-tender.dto");
class UpdateTenderDto extends (0, mapped_types_1.PartialType)(create_tender_dto_1.CreateTenderDto) {
}
exports.UpdateTenderDto = UpdateTenderDto;
//# sourceMappingURL=update-tender.dto.js.map