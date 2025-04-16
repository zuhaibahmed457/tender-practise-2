import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllAddressesDto } from './dto/get-all-addresses.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(user: User, createAddressDto: CreateAddressDto) {
    const { latitude, longitude, ...rest } = createAddressDto;

    const address = this.addressRepository.create({
      ...rest,
      coordinates: { type: 'Point', coordinates: [longitude, latitude] },
      created_by: user,
    });

    return address.save();
  }

  async findAll(currentUser: User, getAllAddressesDto: GetAllAddressesDto) {
    const { per_page, page, search, user_id } = getAllAddressesDto;

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      currentUser.id !== user_id
    ) {
      throw new ForbiddenException('Unauthorized to see address');
    }

    const query = this.addressRepository
      .createQueryBuilder('address')
      .where('address.created_by_id = :id', { id: user_id })
      .orderBy('address.created_at', 'DESC');

    if (search) {
      query.andWhere('address.label ILIKE :search', { search: `%${search}%` });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return paginate<Address>(query, paginationOptions);
  }

  async findOne({ id }: ParamIdDto, currentUser: User) {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: {
        created_by: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    if (
      [UserRole.ORGANIZATION, UserRole.TRANSPORTER].includes(
        currentUser.role,
      ) &&
      currentUser.id !== address.created_by.id
    ) {
      throw new ForbiddenException('Unauthorized to see address');
    }

    return address;
  }

  async update(
    { id }: ParamIdDto,
    updateAddressDto: UpdateAddressDto,
    currentUser: User,
  ) {
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
      throw new NotFoundException('Address not found');
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

  async remove({ id }: ParamIdDto, currentUser: User) {
    const address = await this.addressRepository.findOne({
      where: {
        id,
        created_by: {
          id: currentUser.id,
        },
      },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return this.addressRepository.remove(address);
  }
}
