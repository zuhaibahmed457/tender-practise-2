import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllAddressesDto } from './dto/get-all-addresses.dto';
export declare class AddressService {
    private readonly addressRepository;
    constructor(addressRepository: Repository<Address>);
    create(user: User, createAddressDto: CreateAddressDto): Promise<Address>;
    findAll(currentUser: User, getAllAddressesDto: GetAllAddressesDto): Promise<import("nestjs-typeorm-paginate").Pagination<Address, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto, currentUser: User): Promise<Address>;
    update({ id }: ParamIdDto, updateAddressDto: UpdateAddressDto, currentUser: User): Promise<Address>;
    remove({ id }: ParamIdDto, currentUser: User): Promise<Address>;
}
