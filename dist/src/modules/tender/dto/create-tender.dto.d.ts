import { MemoryStoredFile } from 'nestjs-form-data';
export declare class CreateTenderDto {
    title: string;
    bid_deadline: Date;
    tender_budget_amount: number;
    size_id: string;
    quantity: number;
    industry_ids: string[];
    transporter_required: boolean;
    transportation_budget_amount?: number;
    pickup_address_id?: string;
    dropoff_address_id?: string;
    tender_image: MemoryStoredFile;
}
