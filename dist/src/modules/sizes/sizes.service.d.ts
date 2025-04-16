import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { Size } from './entities/size.entity';
import { Repository } from 'typeorm';
import { GetAllSizesDto } from './dto/get-all-sizes.dto';
export declare class SizesService {
    private readonly sizeRepository;
    constructor(sizeRepository: Repository<Size>);
    create(createSizeDto: CreateSizeDto): string;
    findAll(getAllSizesDto: GetAllSizesDto): Promise<import("nestjs-typeorm-paginate").Pagination<Size, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne(id: number): string;
    update(id: number, updateSizeDto: UpdateSizeDto): string;
    remove(id: number): string;
}
