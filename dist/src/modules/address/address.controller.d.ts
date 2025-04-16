import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllAddressesDto } from './dto/get-all-addresses.dto';
export declare class AddressController {
    private readonly addressService;
    constructor(addressService: AddressService);
    create(user: User, createAddressDto: CreateAddressDto): Promise<IResponse>;
    findAll(currentUser: User, getAllAddressesDto: GetAllAddressesDto): Promise<{
        message: string;
        details: import("./entities/address.entity").Address[];
        extra: import("nestjs-typeorm-paginate").IPaginationMeta;
    }>;
    findOne(currentUser: User, paramIdDto: ParamIdDto): Promise<IResponse>;
    update(currentUser: User, paramIdDto: ParamIdDto, updateAddressDto: UpdateAddressDto): Promise<IResponse>;
    remove(currentUser: User, paramIdDto: ParamIdDto): Promise<{
        message: string;
    }>;
}
