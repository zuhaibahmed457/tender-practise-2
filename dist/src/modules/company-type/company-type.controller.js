"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyTypeController = void 0;
const common_1 = require("@nestjs/common");
const company_type_service_1 = require("./company-type.service");
const create_company_type_dto_1 = require("./dto/create-company-type.dto");
const update_company_type_dto_1 = require("./dto/update-company-type.dto");
const get_all_company_types_dto_1 = require("./dto/get-all-company-types.dto");
let CompanyTypeController = class CompanyTypeController {
    constructor(companyTypeService) {
        this.companyTypeService = companyTypeService;
    }
    create(createCompanyTypeDto) {
        return this.companyTypeService.create(createCompanyTypeDto);
    }
    async findAll(getAllCompanyTypesDto) {
        const { meta, items } = await this.companyTypeService.findAll(getAllCompanyTypesDto);
        return {
            message: 'Company types fetched successfully',
            details: items,
            extra: meta,
        };
    }
    findOne(id) {
        return this.companyTypeService.findOne(+id);
    }
    update(id, updateCompanyTypeDto) {
        return this.companyTypeService.update(+id, updateCompanyTypeDto);
    }
    remove(id) {
        return this.companyTypeService.remove(+id);
    }
};
exports.CompanyTypeController = CompanyTypeController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_company_type_dto_1.CreateCompanyTypeDto]),
    __metadata("design:returntype", void 0)
], CompanyTypeController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_company_types_dto_1.GetAllCompanyTypesDto]),
    __metadata("design:returntype", Promise)
], CompanyTypeController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyTypeController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_company_type_dto_1.UpdateCompanyTypeDto]),
    __metadata("design:returntype", void 0)
], CompanyTypeController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CompanyTypeController.prototype, "remove", null);
exports.CompanyTypeController = CompanyTypeController = __decorate([
    (0, common_1.Controller)('company-type'),
    __metadata("design:paramtypes", [company_type_service_1.CompanyTypeService])
], CompanyTypeController);
//# sourceMappingURL=company-type.controller.js.map