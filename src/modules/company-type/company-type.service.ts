import { Injectable } from '@nestjs/common';
import { CreateCompanyTypeDto } from './dto/create-company-type.dto';
import { UpdateCompanyTypeDto } from './dto/update-company-type.dto';
import { GetAllCompanyTypesDto } from './dto/get-all-company-types.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CompanyType } from './entities/company-type.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyTypeService {
  constructor(
    @InjectRepository(CompanyType)
    private readonly companyTypeRepository: Repository<CompanyType>,
  ) {}

  create(createCompanyTypeDto: CreateCompanyTypeDto) {
    return 'This action adds a new companyType';
  }

  async findAll(getAllCompanyTypesDto: GetAllCompanyTypesDto) {
    const { page, per_page, search, status } = getAllCompanyTypesDto;

    const query = this.companyTypeRepository.createQueryBuilder('companyType');

    if (status) {
      query.andWhere('companyType.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(companyType.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return paginate<CompanyType>(query, paginationOptions);
  }

  findOne(id: number) {
    return `This action returns a #${id} companyType`;
  }

  update(id: number, updateCompanyTypeDto: UpdateCompanyTypeDto) {
    return `This action updates a #${id} companyType`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyType`;
  }
}
