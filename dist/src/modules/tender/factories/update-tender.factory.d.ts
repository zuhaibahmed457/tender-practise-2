import { UpdateTenderDto } from '../dto/update-tender.dto';
import { TenderStatus } from '../entities/tender.entity';
export declare class TenderPolicyFactory {
    private static getAllowedFields;
    static canUpdate(status: TenderStatus, updateTenderDto: UpdateTenderDto): void;
}
