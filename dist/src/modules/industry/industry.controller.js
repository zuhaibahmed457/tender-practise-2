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
exports.IndustryController = void 0;
const common_1 = require("@nestjs/common");
const industry_service_1 = require("./industry.service");
const create_industry_dto_1 = require("./dto/create-industry.dto");
const update_industry_dto_1 = require("./dto/update-industry.dto");
const get_all_industries_dto_1 = require("./dto/get-all-industries.dto");
let IndustryController = class IndustryController {
    constructor(industryService) {
        this.industryService = industryService;
    }
    create(createIndustryDto) {
        return this.industryService.create(createIndustryDto);
    }
    async findAll(getAllIndustriesDto) {
        const { meta, items } = await this.industryService.findAll(getAllIndustriesDto);
        return {
            message: 'Industries fetched successfully',
            details: items,
            extra: meta,
        };
    }
    findOne(id) {
        return this.industryService.findOne(+id);
    }
    update(id, updateIndustryDto) {
        return this.industryService.update(+id, updateIndustryDto);
    }
    remove(id) {
        return this.industryService.remove(+id);
    }
};
exports.IndustryController = IndustryController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_industry_dto_1.CreateIndustryDto]),
    __metadata("design:returntype", void 0)
], IndustryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_industries_dto_1.GetAllIndustriesDto]),
    __metadata("design:returntype", Promise)
], IndustryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndustryController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_industry_dto_1.UpdateIndustryDto]),
    __metadata("design:returntype", void 0)
], IndustryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IndustryController.prototype, "remove", null);
exports.IndustryController = IndustryController = __decorate([
    (0, common_1.Controller)('industry'),
    __metadata("design:paramtypes", [industry_service_1.IndustryService])
], IndustryController);
//# sourceMappingURL=industry.controller.js.map