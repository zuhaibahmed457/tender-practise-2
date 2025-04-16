import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Query,
  Put,
  Body,
} from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { RolesDecorator } from 'src/shared/guards/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryService } from './country.service';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { GetAllCountryDto } from './dto/get-all-country.dto';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN) // Assuming only admins can create countries
  @FormDataRequest()
  async create(
    @Body() createCountryDto: CreateCountryDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const country = await this.countryService.create(createCountryDto);
    return {
      message: 'Country created successfully',
      details: country,
    };
  }

  @Get('')
  async findAll(
    @Query() getAllCountryDto: GetAllCountryDto,
    @CurrentUser() user?: User,
  ): Promise<IResponse> {
    const { items, meta } = await this.countryService.findAll(
      getAllCountryDto,
      user,
    );
    return {
      message: 'Countries fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  async findOne(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    const country = await this.countryService.findOne(paramIdDto);
    return {
      message: 'Country fetched successfully',
      details: country,
    };
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN) // Assuming only admins can update countries
  @FormDataRequest()
  async update(
    @Param() paramIdDto: ParamIdDto,
    @Body() updateCountryDto: UpdateCountryDto,
    @CurrentUser() user: User,
  ): Promise<IResponse> {
    const updatedCountry = await this.countryService.update(
      paramIdDto,
      updateCountryDto,
    );
    return {
      message: 'Country updated successfully',
      details: updatedCountry,
    };
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, RolesGuard)
  @RolesDecorator(UserRole.ADMIN) // Assuming only admins can delete countries
  async remove(@Param() paramIdDto: ParamIdDto): Promise<IResponse> {
    await this.countryService.remove(paramIdDto);
    return {
      message: 'Country deleted successfully',
    };
  }
}
