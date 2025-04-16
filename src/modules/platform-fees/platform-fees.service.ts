import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformFee } from './entities/platform-fee.entity';
import { Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class PlatformFeesService {
  constructor(
    @InjectRepository(PlatformFee)
    private readonly platformFeeRepository: Repository<PlatformFee>,
  ) {}

  async create(createPlatformFeeDto: CreatePlatformFeeDto) {
    const isPlatformFeeDto = await this.platformFeeRepository.findOne({
      where: {
        label: createPlatformFeeDto.label,
      },
    });

    if (isPlatformFeeDto)
      throw new BadRequestException('This platform fee already exists');

    const platformFee = this.platformFeeRepository.create(createPlatformFeeDto);
    return await platformFee.save();
  }

  async findAll(getAllDto: GetAllDto) {
    const { page, per_page, search } = getAllDto;

    const query = this.platformFeeRepository
      .createQueryBuilder('platform_fee')
      .where('platform_fee.deleted_at IS NULL');

    if (search) {
      query.andWhere(
        '(platform_fee.label ILIKE :search OR platform.type ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('platform_fee.created_at', 'DESC');

    const paginationOption: IPaginationOptions = {
      page,
      limit: per_page,
    };

    return await paginate(query, paginationOption);
  }

  async findOne({ id }: ParamIdDto) {
    const platformFee = await this.platformFeeRepository.findOne({
      where: {
        id,
      },
    });

    if (!platformFee) throw new NotFoundException('Platform Fee not found');

    return platformFee;
  }

  async update({ id }: ParamIdDto, updatePlatformFeeDto: UpdatePlatformFeeDto) {
    const platformFee = await this.findOne({ id });

    const { label, ...restBody } = updatePlatformFeeDto;
    Object.assign(platformFee, restBody);
    return await platformFee.save();
  }
}
