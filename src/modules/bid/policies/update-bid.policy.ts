import { BidStatus } from '../entities/bid.entity';

export const BidPolicy = {
  [BidStatus.CREATED]: ['delivery_date', 'amount', 'priority'],
  [BidStatus.IN_TRANSACTION]: ['priority'],
  [BidStatus.ACCEPTED]: ['priority'],
};
