export enum BidStatusCanBeRetrieveBy {
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
  CREATOR_ORGANIZATION = 'creator_organization',
  BIDDING_ORGANIZATION = 'bidding_organization',
}

const genericFelids = [
  "search",
  'bid_status',
  'start_date',
  'end_date',
  'delivery_date_start',
  'delivery_date_end',
  'page',
  'per_page',
]

export const GetAllBidsPolicy = {
  allowedFields: {
    [BidStatusCanBeRetrieveBy.SUPER_ADMIN]: [
      'tender_id',
      'poster_id',
      'bidder_id',
      ...genericFelids
    ],
    [BidStatusCanBeRetrieveBy.ADMIN]: [
      'tender_id',
      'poster_id',
      'bidder_id',
      ...genericFelids
    ],
    [BidStatusCanBeRetrieveBy.CREATOR_ORGANIZATION]: [
      'tender_id',
      'poster_id',
      ...genericFelids,
    ],

    [BidStatusCanBeRetrieveBy.BIDDING_ORGANIZATION]: [
      'bidder_id',
      ...genericFelids,
    ],

  },
  allowedValues: {
    tender_status: {
      [BidStatusCanBeRetrieveBy.SUPER_ADMIN]: Object.values(BidStatusCanBeRetrieveBy),
      [BidStatusCanBeRetrieveBy.ADMIN]: Object.values(BidStatusCanBeRetrieveBy),
      [BidStatusCanBeRetrieveBy.CREATOR_ORGANIZATION]: [BidStatusCanBeRetrieveBy.CREATOR_ORGANIZATION],
      [BidStatusCanBeRetrieveBy.BIDDING_ORGANIZATION]: [BidStatusCanBeRetrieveBy.BIDDING_ORGANIZATION],
    },
  },
};
