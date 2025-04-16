import { Tender, TenderStatus } from '../entities/tender.entity';

export enum TenderStatusCanBeUpdatedBy {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  CREATOR_ORGANIZATION = 'creator_organization',
  BIDDING_ORGANIZATION = 'bidding_organization',
}

export const ManageTenderStatusPolicy = {
  [TenderStatusCanBeUpdatedBy.SUPER_ADMIN]: {
    [TenderStatus.PENDING_APPROVAL]: [
      TenderStatus.APPROVED,
      TenderStatus.REJECTED,
    ],
    [TenderStatus.APPROVED]: [TenderStatus.IN_ACTIVE],
    [TenderStatus.IN_ACTIVE]: [TenderStatus.APPROVED],
  },
  [TenderStatusCanBeUpdatedBy.ADMIN]: {
    [TenderStatus.PENDING_APPROVAL]: [
      TenderStatus.APPROVED,
      TenderStatus.REJECTED,
    ],
    [TenderStatus.APPROVED]: [TenderStatus.IN_ACTIVE],
    [TenderStatus.IN_ACTIVE]: [TenderStatus.APPROVED],
  },

  [TenderStatusCanBeUpdatedBy.CREATOR_ORGANIZATION]: {
    [TenderStatus.DRAFT]: [TenderStatus.PENDING_APPROVAL], // Organization submits tender
    [TenderStatus.DELIVERED]: [TenderStatus.RECEIVED], // Organization confirms delivery
  },
  [TenderStatusCanBeUpdatedBy.BIDDING_ORGANIZATION]: {
    [TenderStatus.IN_PROGRESS]: [TenderStatus.DELIVERED],
  },
};
