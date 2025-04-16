import { TenderService } from './tender.service';
import { CreateTenderDto } from './dto/create-tender.dto';
import { UpdateTenderDto } from './dto/update-tender.dto';
import { User } from '../users/entities/user.entity';
import { ParamIdDto } from 'src/shared/dtos/paramId.dto';
import { GetAllTendersDto } from './dto/get-all-tenders.dto';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { IResponse } from 'src/shared/interfaces/response.interface';
import { ManageStatusDto } from './dto/manage-status.dto';
export declare class TenderController {
    private readonly tenderService;
    constructor(tenderService: TenderService);
    create(currentUser: User, createTenderDto: CreateTenderDto): Promise<{
        message: string;
        details: import("./entities/tender.entity").Tender;
    }>;
    findAll(currentUser: User, getAllTendersDto: GetAllTendersDto): Promise<{
        message: string;
        details: import("./entities/tender.entity").Tender[];
        extra: import("nestjs-typeorm-paginate").IPaginationMeta;
    }>;
    findBidWithNonCreatedStatus(currentUser: User, paramIdDto: ParamIdDto): Promise<{
        message: string;
        details: import("../bid/entities/bid.entity").Bid;
    }>;
    manageStatus(currentUser: User, manageStatusDto: ManageStatusDto, paramIdDto: ParamIdDto): Promise<{
        message: string;
        tender: import("./entities/tender.entity").Tender;
    }>;
    findOne(currentUser: User, paramIdDto: ParamIdDto): Promise<IResponse>;
    update(currentUser: User, paramIdDto: ParamIdDto, updateTenderDto: UpdateTenderDto): Promise<IResponse>;
    createAttachment(currentUser: User, tender_id: string, createAttachmentDto: CreateAttachmentDto): Promise<IResponse>;
    deleteAttachment(currentUser: User, tender_id: string, attachment_id: string): Promise<{
        message: string;
    }>;
    remove(id: string): string;
}
