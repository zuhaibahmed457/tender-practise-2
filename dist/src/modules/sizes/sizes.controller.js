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
exports.SizesController = void 0;
const common_1 = require("@nestjs/common");
const sizes_service_1 = require("./sizes.service");
const create_size_dto_1 = require("./dto/create-size.dto");
const update_size_dto_1 = require("./dto/update-size.dto");
const get_all_sizes_dto_1 = require("./dto/get-all-sizes.dto");
let SizesController = class SizesController {
    constructor(sizesService) {
        this.sizesService = sizesService;
    }
    create(createSizeDto) {
        return this.sizesService.create(createSizeDto);
    }
    async findAll(getAllSizesDto) {
        const { meta, items } = await this.sizesService.findAll(getAllSizesDto);
        return {
            message: 'Sizes fetched successfully',
            details: items,
            extra: meta,
        };
    }
    findOne(id) {
        return this.sizesService.findOne(+id);
    }
    update(id, updateSizeDto) {
        return this.sizesService.update(+id, updateSizeDto);
    }
    remove(id) {
        return this.sizesService.remove(+id);
    }
};
exports.SizesController = SizesController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_size_dto_1.CreateSizeDto]),
    __metadata("design:returntype", void 0)
], SizesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [get_all_sizes_dto_1.GetAllSizesDto]),
    __metadata("design:returntype", Promise)
], SizesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SizesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_size_dto_1.UpdateSizeDto]),
    __metadata("design:returntype", void 0)
], SizesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SizesController.prototype, "remove", null);
exports.SizesController = SizesController = __decorate([
    (0, common_1.Controller)('sizes'),
    __metadata("design:paramtypes", [sizes_service_1.SizesService])
], SizesController);
//# sourceMappingURL=sizes.controller.js.map