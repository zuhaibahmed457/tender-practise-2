import { SizesService } from './sizes.service';
import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { GetAllSizesDto } from './dto/get-all-sizes.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
export declare class SizesController {
    private readonly sizesService;
    constructor(sizesService: SizesService);
    create(createSizeDto: CreateSizeDto): string;
    findAll(getAllSizesDto: GetAllSizesDto): Promise<IResponse>;
    findOne(id: string): string;
    update(id: string, updateSizeDto: UpdateSizeDto): string;
    remove(id: string): string;
}
