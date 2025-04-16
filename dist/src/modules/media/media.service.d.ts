import { CreateMediaDto } from './dto/create-media.dto';
import { Media } from './entities/media.entity';
import { Repository } from 'typeorm';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { S3Service } from 'src/shared/services/s3.service';
import { User } from '../users/entities/user.entity';
export declare class MediaService {
    private readonly mediaRepo;
    private readonly s3Service;
    constructor(mediaRepo: Repository<Media>, s3Service: S3Service);
    createMedia(currentUser: User, createMediaDto: CreateMediaDto): Promise<Media>;
    deleteMedia(currentUser: User, { id }: ParamIdDto): Promise<void>;
    deleteMultipleFiles({ id }: ParamIdDto): Promise<void>;
}
