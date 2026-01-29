export type AuctionStatus = "active" | "ended";

export interface Auction {
    id: string;
    title: string;
    description: string;
    images: string[];
    startingPrice: number;
    endAt: string;
    createdAt: string;
}

export interface Bid {
    id: string;
    auctionId: string;
    bidderName: string;
    amount: number;
    createdAt: string;
}

export interface AuctionListItem extends Auction {
    status: AuctionStatus;
    currentPrice: number;
    bidsCount: number;
}
