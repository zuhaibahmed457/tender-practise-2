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
exports.SizesService = void 0;
const common_1 = require("@nestjs/common");
const size_entity_1 = require("./entities/size.entity");
const typeorm_1 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
const typeorm_2 = require("@nestjs/typeorm");
let SizesService = class SizesService {
    constructor(sizeRepository) {
        this.sizeRepository = sizeRepository;
    }
    create(createSizeDto) {
        return 'This action adds a new size';
    }
    async findAll(getAllSizesDto) {
        const { page, per_page, search, status } = getAllSizesDto;
        const query = this.sizeRepository.createQueryBuilder('size');
        if (status) {
            query.andWhere('size.status = :status', { status });
        }
        if (search) {
            query.andWhere('(size.range ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    findOne(id) {
        return `This action returns a #${id} size`;
    }
    update(id, updateSizeDto) {
        return `This action updates a #${id} size`;
    }
    remove(id) {
        return `This action removes a #${id} size`;
    }
};
exports.SizesService = SizesService;
exports.SizesService = SizesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(size_entity_1.Size)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], SizesService);
//# sourceMappingURL=sizes.service.js.map