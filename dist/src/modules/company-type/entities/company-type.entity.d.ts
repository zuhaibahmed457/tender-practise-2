export declare enum CompanyTypeStatus {
    ACTIVE = "active",
    IN_ACTIVE = "inactive"
}
export declare class CompanyType {
    id: string;
    name: string;
    status: CompanyTypeStatus;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date;
}
