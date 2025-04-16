import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PlatformFeesService } from './platform-fees.service';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { FormDataRequest } from 'nestjs-form-data';

@Controller('platform-fees')
export class PlatformFeesController {
  constructor(private readonly platformFeesService: PlatformFeesService) {}

  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  @Post()
  async create(
    @Body() createPlatformFeeDto: CreatePlatformFeeDto,
  ): Promise<IResponse> {
    const platformFee =
      await this.platformFeesService.create(createPlatformFeeDto);
    return {
      message: 'Platform Fee created successfully',
      details: platformFee,
    };
  }

  @Get()
  async findAll(@Query() getAllDto: GetAllDto): Promise<IResponse> {
    const { items, meta } = await this.platformFeesService.findAll(getAllDto);
    return {
      message: 'Platform Fees fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const platformFee = await this.platformFeesService.findOne(paramIdDto);
    return {
      message: 'Platform Fee fetched successfully',
      details: platformFee,
    };
  }

  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @FormDataRequest()
  @Patch(':id')
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updatePlatformFeeDto: UpdatePlatformFeeDto,
  ): Promise<IResponse> {
    const updatedPlatformFee = await this.platformFeesService.update(
      paramIdDto,
      updatePlatformFeeDto,
    );
    return {
      message: 'Platform Fee updated successfully',
      details: updatedPlatformFee,
    };
  }
}
