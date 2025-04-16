import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    createMedia(currentUser: User, createMediaDto: CreateMediaDto): Promise<{
        message: string;
        details: import("./entities/media.entity").Media;
    }>;
    deleteMedia(currentUser: User, paramIdDto: ParamIdDto): Promise<{
        message: string;
        details: void;
    }>;
}
