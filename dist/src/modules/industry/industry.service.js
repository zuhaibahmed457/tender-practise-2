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
exports.IndustryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const industry_entity_1 = require("./entities/industry.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let IndustryService = class IndustryService {
    constructor(industryRepository) {
        this.industryRepository = industryRepository;
    }
    create(createIndustryDto) {
        return 'This action adds a new industry';
    }
    async findAll(getAllIndustriesDto) {
        const { page, per_page, search, status, exclude_mine, user_id, only_include_mine, } = getAllIndustriesDto;
        const query = this.industryRepository.createQueryBuilder('industry');
        if (exclude_mine && user_id) {
            query
                .leftJoin('industry.user_industries', 'user_industries', 'user_industries.user_id = :user_id', { user_id })
                .andWhere('user_industries.id IS NULL');
        }
        if (status) {
            query.andWhere('industry.status = :status', { status });
        }
        if (only_include_mine && user_id) {
            query
                .leftJoin('industry.user_industries', 'user_industries', 'user_industries.industry_id = industry.id AND user_industries.user_id = :user_id', { user_id })
                .andWhere('user_industries.id IS NOT NULL');
        }
        if (search) {
            query.andWhere('(industry.name ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        query.orderBy('industry.name', 'ASC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    findOne(id) {
        return `This action returns a #${id} industry`;
    }
    update(id, updateIndustryDto) {
        return `This action updates a #${id} industry`;
    }
    remove(id) {
        return `This action removes a #${id} industry`;
    }
};
exports.IndustryService = IndustryService;
exports.IndustryService = IndustryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(industry_entity_1.Industry)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], IndustryService);
//# sourceMappingURL=industry.service.js.map