import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { PlatformFee } from './entities/platform-fee.entity';
import { Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
export declare class PlatformFeesService {
    private readonly platformFeeRepository;
    constructor(platformFeeRepository: Repository<PlatformFee>);
    create(createPlatformFeeDto: CreatePlatformFeeDto): Promise<PlatformFee>;
    findAll(getAllDto: GetAllDto): Promise<import("nestjs-typeorm-paginate").Pagination<PlatformFee, import("nestjs-typeorm-paginate").IPaginationMeta>>;
    findOne({ id }: ParamIdDto): Promise<PlatformFee>;
    update({ id }: ParamIdDto, updatePlatformFeeDto: UpdatePlatformFeeDto): Promise<PlatformFee>;
}
