"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompanyTypeDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_company_type_dto_1 = require("./create-company-type.dto");
class UpdateCompanyTypeDto extends (0, mapped_types_1.PartialType)(create_company_type_dto_1.CreateCompanyTypeDto) {
}
exports.UpdateCompanyTypeDto = UpdateCompanyTypeDto;
//# sourceMappingURL=update-company-type.dto.js.map