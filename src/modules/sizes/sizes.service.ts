import { Injectable } from '@nestjs/common';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';
import { GetAllSizesDto } from './dto/get-all-sizes.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SizesService {
  constructor(
    @InjectRepository(Size) private readonly sizeRepository: Repository<Size>,
  ) {}

  create(createSizeDto: CreateSizeDto) {
    return 'This action adds a new size';
  }

  async findAll(getAllSizesDto: GetAllSizesDto) {
    const { page, per_page, search, status } = getAllSizesDto;

    const query = this.sizeRepository.createQueryBuilder('size');

    if (status) {
      query.andWhere('size.status = :status', { status });
    }

    if (search) {
      query.andWhere('(size.range ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return paginate<Size>(query, paginationOptions);
  }

  findOne(id: number) {
    return `This action returns a #${id} size`;
  }

  update(id: number, updateSizeDto: UpdateSizeDto) {
    return `This action updates a #${id} size`;
  }

  remove(id: number) {
    return `This action removes a #${id} size`;
  }
}
