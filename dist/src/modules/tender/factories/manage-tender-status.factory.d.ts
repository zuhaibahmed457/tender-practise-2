import { TenderStatus } from '../entities/tender.entity';
import { TenderStatusCanBeUpdatedBy } from '../policies/manage-tender-status.policy';
export declare class ManageTenderStatusPolicyFactory {
    static canUpdateStatus(currentStatus: TenderStatus, newStatus: TenderStatus, role: TenderStatusCanBeUpdatedBy): void;
}
