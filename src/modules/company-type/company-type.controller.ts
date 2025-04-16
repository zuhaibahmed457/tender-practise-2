import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CompanyTypeService } from './company-type.service';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllCompanyTypesDto } from './dto/get-all-company-types.dto';

@Controller('company-type')
export class CompanyTypeController {
  constructor(private readonly companyTypeService: CompanyTypeService) {}

  @Post()
  create(@Body() createCompanyTypeDto: CreateCompanyTypeDto) {
    return this.companyTypeService.create(createCompanyTypeDto);
  }

  @Get()
  async findAll(
    @Query() getAllCompanyTypesDto: GetAllCompanyTypesDto,
  ): Promise<IResponse> {
    const { meta, items } = await this.companyTypeService.findAll(
      getAllCompanyTypesDto,
    );

    return {
      message: 'Company types fetched successfully',
      details: items,
      extra: meta,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCompanyTypeDto: UpdateCompanyTypeDto,
  ) {
    return this.companyTypeService.update(+id, updateCompanyTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyTypeService.remove(+id);
  }
}
