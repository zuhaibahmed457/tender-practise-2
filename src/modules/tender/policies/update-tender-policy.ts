import { TenderStatus } from '../entities/tender.entity';

export const TenderPolicy = {
  [TenderStatus.DRAFT]: [
    'title',
    'bid_deadline',
    'tender_budget_amount',
    'size_id',
    'quantity',
    'industry_ids',
    'transporter_required',
    'transportation_budget_amount',
    'pickup_address_id',
    'dropoff_address_id',
    'tender_image',
  ],
  [TenderStatus.PENDING_APPROVAL]: [
    'pickup_address_id',
    'dropoff_address_id',
    'transporter_required',
  ],
  [TenderStatus.APPROVED]: [
    'pickup_address_id',
    'dropoff_address_id',
    'transporter_required',
  ],
  [TenderStatus.REJECTED]: [],
};
