import { BaseEntity } from 'typeorm';
export declare enum CountryStatuses {
    ACTIVE = "active",
    IN_ACTIVE = "inactive"
}
export declare class Country extends BaseEntity {
    id: string;
    code: string;
    name: string;
    country_code: string;
    status: CountryStatuses;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
