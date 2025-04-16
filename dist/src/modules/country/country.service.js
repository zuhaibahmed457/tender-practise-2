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
exports.CountryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const country_entity_1 = require("./entities/country.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let CountryService = class CountryService {
    constructor(countryRepository) {
        this.countryRepository = countryRepository;
    }
    async create(createCountryDto) {
        const country = this.countryRepository.create(createCountryDto);
        return await this.countryRepository.save(country);
    }
    async findAll(getAllDto, user) {
        const { search, status, code, page, per_page } = getAllDto;
        const countryQuery = this.countryRepository
            .createQueryBuilder('country')
            .where('country.deleted_at IS NULL');
        if (status && status !== 'all') {
            countryQuery.andWhere('country.status = :status', { status });
        }
        if (search) {
            countryQuery.andWhere('(country.name ILIKE :search OR country.code ILIKE :search)', { search: `%${search}%` });
        }
        countryQuery.orderBy('country.name', 'ASC');
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return await (0, nestjs_typeorm_paginate_1.paginate)(countryQuery, paginationOptions);
    }
    async findOne({ id }) {
        const country = await this.countryRepository.findOne({
            where: { id, deleted_at: null },
        });
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        return country;
    }
    async update({ id }, updateCountryDto) {
        const country = await this.countryRepository.findOne({
            where: { id, deleted_at: null },
        });
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        Object.assign(country, updateCountryDto);
        return await this.countryRepository.save(country);
    }
    async remove({ id }) {
        const country = await this.countryRepository.findOne({
            where: { id, deleted_at: null },
        });
        if (!country) {
            throw new common_1.NotFoundException('Country not found');
        }
        country.deleted_at = new Date();
        await this.countryRepository.save(country);
        return { message: 'Country removed successfully' };
    }
};
exports.CountryService = CountryService;
exports.CountryService = CountryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(country_entity_1.Country)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CountryService);
//# sourceMappingURL=country.service.js.map