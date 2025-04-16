import { TenderStatus } from '../entities/tender.entity';
export declare const GetAllTendersPolicy: {
    allowedFields: {
        super_admin: string[];
        admin: string[];
        organization: string[];
        transporter: string[];
    };
    allowedValues: {
        tender_status: {
            super_admin: TenderStatus[];
            admin: TenderStatus[];
            organization: TenderStatus[];
            transporter: TenderStatus[];
        };
    };
};
