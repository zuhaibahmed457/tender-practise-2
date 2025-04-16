import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllAddressesDto } from './dto/get-all-addresses.dto';

@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(
    @CurrentUser() user: User,
    @Body() createAddressDto: CreateAddressDto,
  ): Promise<IResponse> {
    const address = await this.addressService.create(user, createAddressDto);

    return {
      message: 'Address Created Successfully',
      details: address,
    };
  }

  @Get()
  @UseGuards(AuthenticationGuard)
  async findAll(
    @CurrentUser() currentUser: User,
    @Query() getAllAddressesDto: GetAllAddressesDto,
  ) {
    const { items, meta } = await this.addressService.findAll(
      currentUser,
      getAllAddressesDto,
    );

    return {
      message: 'Address fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard)
  async findOne(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
  ): Promise<IResponse> {
    const address = await this.addressService.findOne(paramIdDto, currentUser);

    return {
      message: 'Address fetched successfully',
      details: address,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard)
  async update(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
    @Body() updateAddressDto: UpdateAddressDto,
  ): Promise<IResponse> {
    const updatedAddress = await this.addressService.update(
      paramIdDto,
      updateAddressDto,
      currentUser,
    );

    return {
      message: 'Address updated successfully',
      details: updatedAddress,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard)
  async remove(
    @CurrentUser() currentUser: User,
    @Param() paramIdDto: ParamIdDto,
  ) {
    const deletedAddress = await this.addressService.remove(
      paramIdDto,
      currentUser,
    );

    return {
      message: 'Address deleted successfully',
    };
  }
}
