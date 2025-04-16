import { PlatformFeesService } from './platform-fees.service';
import { CreatePlatformFeeDto } from './dto/create-platform-fee.dto';
import { UpdatePlatformFeeDto } from './dto/update-platform-fee.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class PlatformFeesController {
    private readonly platformFeesService;
    constructor(platformFeesService: PlatformFeesService);
    create(createPlatformFeeDto: CreatePlatformFeeDto): Promise<IResponse>;
    findAll(getAllDto: GetAllDto): Promise<IResponse>;
    findOne(paramIdDto: ParamIdDto): Promise<IResponse>;
    update(paramIdDto: ParamIdDto, updatePlatformFeeDto: UpdatePlatformFeeDto): Promise<IResponse>;
}
