import { GetAllDto } from 'src/shared/dtos/getAll.dto';
import { SizeStatus } from '../entities/size.entity';
export declare class GetAllSizesDto extends GetAllDto {
    status: SizeStatus;
}
