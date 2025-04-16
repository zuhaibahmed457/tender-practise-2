export declare enum BidStatusCanBeRetrieveBy {
    ADMIN = "admin",
    SUPER_ADMIN = "super_admin",
    CREATOR_ORGANIZATION = "creator_organization",
    BIDDING_ORGANIZATION = "bidding_organization"
}
export declare const GetAllBidsPolicy: {
    allowedFields: {
        super_admin: string[];
        admin: string[];
        creator_organization: string[];
        bidding_organization: string[];
    };
    allowedValues: {
        tender_status: {
            super_admin: BidStatusCanBeRetrieveBy[];
            admin: BidStatusCanBeRetrieveBy[];
            creator_organization: BidStatusCanBeRetrieveBy[];
            bidding_organization: BidStatusCanBeRetrieveBy[];
        };
    };
};
