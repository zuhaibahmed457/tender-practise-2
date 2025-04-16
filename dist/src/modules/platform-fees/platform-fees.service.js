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
exports.PlatformFeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_fee_entity_1 = require("./entities/platform-fee.entity");
const typeorm_2 = require("typeorm");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let PlatformFeesService = class PlatformFeesService {
    constructor(platformFeeRepository) {
        this.platformFeeRepository = platformFeeRepository;
    }
    async create(createPlatformFeeDto) {
        const isPlatformFeeDto = await this.platformFeeRepository.findOne({
            where: {
                label: createPlatformFeeDto.label,
            },
        });
        if (isPlatformFeeDto)
            throw new common_1.BadRequestException('This platform fee already exists');
        const platformFee = this.platformFeeRepository.create(createPlatformFeeDto);
        return await platformFee.save();
    }
    async findAll(getAllDto) {
        const { page, per_page, search } = getAllDto;
        const query = this.platformFeeRepository
            .createQueryBuilder('platform_fee')
            .where('platform_fee.deleted_at IS NULL');
        if (search) {
            query.andWhere('(platform_fee.label ILIKE :search OR platform.type ILIKE :search)', { search: `%${search}%` });
        }
        query.orderBy('platform_fee.created_at', 'DESC');
        const paginationOption = {
            page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOption);
    }
    async findOne({ id }) {
        const platformFee = await this.platformFeeRepository.findOne({
            where: {
                id,
            },
        });
        if (!platformFee)
            throw new common_1.NotFoundException('Platform Fee not found');
        return platformFee;
    }
    async update({ id }, updatePlatformFeeDto) {
        const platformFee = await this.findOne({ id });
        const { label, ...restBody } = updatePlatformFeeDto;
        Object.assign(platformFee, restBody);
        return await platformFee.save();
    }
};
exports.PlatformFeesService = PlatformFeesService;
exports.PlatformFeesService = PlatformFeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(platform_fee_entity_1.PlatformFee)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PlatformFeesService);
//# sourceMappingURL=platform-fees.service.js.map