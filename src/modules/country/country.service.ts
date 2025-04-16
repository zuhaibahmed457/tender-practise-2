import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from './entities/country.entity';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllCountryDto } from './dto/get-all-country.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto) {
    const country = this.countryRepository.create(createCountryDto);
    return await this.countryRepository.save(country);
  }

  async findAll(getAllDto: GetAllCountryDto, user: User) {
    const { search, status, code, page, per_page } = getAllDto;
    const countryQuery = this.countryRepository
      .createQueryBuilder('country')
      .where('country.deleted_at IS NULL');

    if (status && status !== 'all') {
      countryQuery.andWhere('country.status = :status', { status });
    }

    if (search) {
      countryQuery.andWhere(
        '(country.name ILIKE :search OR country.code ILIKE :search)',
        { search: `%${search}%` },
      );
    }
    countryQuery.orderBy('country.name', 'ASC');

    const paginationOptions: IPaginationOptions = {
      page: page,
      limit: per_page,
    };

    return await paginate<Country>(countryQuery, paginationOptions);
  }

  async findOne({ id }: ParamIdDto): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id, deleted_at: null },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  async update(
    { id }: ParamIdDto,
    updateCountryDto: UpdateCountryDto,
  ): Promise<Country> {
    const country = await this.countryRepository.findOne({
      where: { id, deleted_at: null },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    Object.assign(country, updateCountryDto); // Merge new data
    return await this.countryRepository.save(country);
  }

  async remove({ id }: ParamIdDto) {
    const country = await this.countryRepository.findOne({
      where: { id, deleted_at: null },
    });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    country.deleted_at = new Date(); // Soft delete
    await this.countryRepository.save(country);

    return { message: 'Country removed successfully' };
  }
}
