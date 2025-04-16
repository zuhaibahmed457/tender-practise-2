import { Injectable } from '@nestjs/common';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Industry, IndustryStatus } from './entities/industry.entity';
import { Repository } from 'typeorm';
import { GetAllIndustriesDto } from './dto/get-all-industries.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
  ) {}

  create(createIndustryDto: CreateIndustryDto) {
    return 'This action adds a new industry';
  }

  async findAll(getAllIndustriesDto: GetAllIndustriesDto) {
    const {
      page,
      per_page,
      search,
      status,
      exclude_mine,
      user_id,
      only_include_mine,
    } = getAllIndustriesDto;

    const query = this.industryRepository.createQueryBuilder('industry');

    if (exclude_mine && user_id) {
      query
        .leftJoin(
          'industry.user_industries',
          'user_industries',
          'user_industries.user_id = :user_id',
          { user_id },
        )
        .andWhere('user_industries.id IS NULL');
    }

    if (status) {
      query.andWhere('industry.status = :status', { status });
    }

    if (only_include_mine && user_id) {
      query
        .leftJoin(
          'industry.user_industries',
          'user_industries',
          'user_industries.industry_id = industry.id AND user_industries.user_id = :user_id',
          { user_id },
        )
        .andWhere('user_industries.id IS NOT NULL');
    }

    if (search) {
      query.andWhere('(industry.name ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    query.orderBy('industry.name', 'ASC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return paginate<Industry>(query, paginationOptions);
  }

  findOne(id: number) {
    return `This action returns a #${id} industry`;
  }

  update(id: number, updateIndustryDto: UpdateIndustryDto) {
    return `This action updates a #${id} industry`;
  }

  remove(id: number) {
    return `This action removes a #${id} industry`;
  }
}
