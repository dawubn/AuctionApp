import type { Auction, AuctionListItem, Bid } from "../types";
import { fetchJson } from "./client";

export function getAuctionsApi() {
    return fetchJson<AuctionListItem[]>("/api/auctions");
}

export function getAuctionApi(id: string) {
    return fetchJson<Auction>(`/api/auctions/${id}`);
}

export function createAuctionApi(payload: Omit<Auction, "id" | "createdAt">) {
    return fetchJson<Auction>("/api/auctions", { method: "POST", body: JSON.stringify(payload) });
}

export function getBidsApi(auctionId: string) {
    return fetchJson<Bid[]>(`/api/auctions/${auctionId}/bids`);
}

export function placeBidApi(auctionId: string, payload: { bidderName: string; amount: number }) {
    return fetchJson<Bid>(`/api/auctions/${auctionId}/bids`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
