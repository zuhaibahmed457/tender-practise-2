export declare enum SizeStatus {
    ACTIVE = "active",
    IN_ACTIVE = "inactive"
}
export declare class Size {
    id: string;
    range: string;
    status: SizeStatus;
    updated_at: Date;
    created_at: Date;
    deleted_at: Date;
}
