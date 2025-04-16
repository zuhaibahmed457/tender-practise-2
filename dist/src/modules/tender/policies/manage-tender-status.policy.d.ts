import { TenderStatus } from '../entities/tender.entity';
export declare enum TenderStatusCanBeUpdatedBy {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
    CREATOR_ORGANIZATION = "creator_organization",
    BIDDING_ORGANIZATION = "bidding_organization"
}
export declare const ManageTenderStatusPolicy: {
    super_admin: {
        pending_approval: TenderStatus[];
        approved: TenderStatus[];
        in_active: TenderStatus[];
    };
    admin: {
        pending_approval: TenderStatus[];
        approved: TenderStatus[];
        in_active: TenderStatus[];
    };
    creator_organization: {
        draft: TenderStatus[];
        delivered: TenderStatus[];
    };
    bidding_organization: {
        in_progress: TenderStatus[];
    };
};
