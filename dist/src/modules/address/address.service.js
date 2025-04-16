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
exports.AddressService = void 0;
const common_1 = require("@nestjs/common");
const address_entity_1 = require("./entities/address.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let AddressService = class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    async create(user, createAddressDto) {
        const { latitude, longitude, ...rest } = createAddressDto;
        const address = this.addressRepository.create({
            ...rest,
            coordinates: { type: 'Point', coordinates: [longitude, latitude] },
            created_by: user,
        });
        return address.save();
    }
    async findAll(currentUser, getAllAddressesDto) {
        const { per_page, page, search, user_id } = getAllAddressesDto;
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            currentUser.id !== user_id) {
            throw new common_1.ForbiddenException('Unauthorized to see address');
        }
        const query = this.addressRepository
            .createQueryBuilder('address')
            .where('address.created_by_id = :id', { id: user_id })
            .orderBy('address.created_at', 'DESC');
        if (search) {
            query.andWhere('address.label ILIKE :search', { search: `%${search}%` });
        }
        const paginationOptions = {
            page: page,
            limit: per_page,
        };
        return (0, nestjs_typeorm_paginate_1.paginate)(query, paginationOptions);
    }
    async findOne({ id }, currentUser) {
        const address = await this.addressRepository.findOne({
            where: { id },
            relations: {
                created_by: true,
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        if ([user_entity_1.UserRole.ORGANIZATION, user_entity_1.UserRole.TRANSPORTER].includes(currentUser.role) &&
            currentUser.id !== address.created_by.id) {
            throw new common_1.ForbiddenException('Unauthorized to see address');
        }
        return address;
    }
    async update({ id }, updateAddressDto, currentUser) {
        const { latitude, longitude, ...rest } = updateAddressDto;
        const address = await this.addressRepository.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        Object.assign(address, rest);
        if (latitude && longitude) {
            address.coordinates = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        }
        return this.addressRepository.save(address);
    }
    async remove({ id }, currentUser) {
        const address = await this.addressRepository.findOne({
            where: {
                id,
                created_by: {
                    id: currentUser.id,
                },
            },
        });
        if (!address) {
            throw new common_1.NotFoundException('Address not found');
        }
        return this.addressRepository.remove(address);
    }
};
exports.AddressService = AddressService;
exports.AddressService = AddressService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(address_entity_1.Address)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AddressService);
//# sourceMappingURL=address.service.js.map