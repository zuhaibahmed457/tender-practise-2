"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyTypeModule = void 0;
const common_1 = require("@nestjs/common");
const company_type_service_1 = require("./company-type.service");
const company_type_controller_1 = require("./company-type.controller");
const company_type_entity_1 = require("./entities/company-type.entity");
const typeorm_1 = require("@nestjs/typeorm");
let CompanyTypeModule = class CompanyTypeModule {
};
exports.CompanyTypeModule = CompanyTypeModule;
exports.CompanyTypeModule = CompanyTypeModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([company_type_entity_1.CompanyType])],
        controllers: [company_type_controller_1.CompanyTypeController],
        providers: [company_type_service_1.CompanyTypeService],
    })
], CompanyTypeModule);
//# sourceMappingURL=company-type.module.js.map