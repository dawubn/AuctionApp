import { nanoid } from "nanoid";
import type { Auction, AuctionListItem, AuctionStatus, Bid } from "../types";

const AUCTIONS_KEY = "auction-app:auctions";
const BIDS_KEY = "auction-app:bids";

function readJson<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}
function writeJson<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

function statusOf(endAtIso: string): AuctionStatus {
    return Date.now() < new Date(endAtIso).getTime() ? "active" : "ended";
}

function ensureSeed() {
    const auctions = readJson<Auction[]>(AUCTIONS_KEY, []);
    if (auctions.length > 0) return;

    const now = Date.now();
    const seeded: Auction[] = [
        {
            id: nanoid(),
            title: "Konsola retro",
            description: "Sprawna, w zestawie 2 pady.",
            images: [],
            startingPrice: 50,
            endAt: new Date(now + 1000 * 60 * 60 * 6).toISOString(),
            createdAt: new Date(now).toISOString(),
        },
    ];
    writeJson(AUCTIONS_KEY, seeded);
    writeJson(BIDS_KEY, [] as Bid[]);
}

export function listAuctions(): AuctionListItem[] {
    ensureSeed();
    const auctions = readJson<Auction[]>(AUCTIONS_KEY, []);
    const bids = readJson<Bid[]>(BIDS_KEY, []);

    return auctions
        .map((a) => {
            const auctionBids = bids.filter((b) => b.auctionId === a.id);
            const highest = auctionBids.reduce((m, b) => Math.max(m, b.amount), a.startingPrice);
            return {
                ...a,
                status: statusOf(a.endAt),
                currentPrice: highest,
                bidsCount: auctionBids.length,
            };
        })
        .sort((x, y) => new Date(x.endAt).getTime() - new Date(y.endAt).getTime());
}

export function getAuction(id: string): Auction | null {
    ensureSeed();
    const auctions = readJson<Auction[]>(AUCTIONS_KEY, []);
    return auctions.find((a) => a.id === id) ?? null;
}

export function createAuction(input: Omit<Auction, "id" | "createdAt">): Auction {
    ensureSeed();
    const auctions = readJson<Auction[]>(AUCTIONS_KEY, []);

    const auction: Auction = {
        ...input,
        id: nanoid(),
        createdAt: new Date().toISOString(),
    };

    writeJson(AUCTIONS_KEY, [auction, ...auctions]);
    return auction;
}

export function listBids(auctionId: string): Bid[] {
    ensureSeed();
    const bids = readJson<Bid[]>(BIDS_KEY, []);
    return bids
        .filter((b) => b.auctionId === auctionId)
        .sort((a, b) => b.amount - a.amount || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createBid(args: { auctionId: string; bidderName: string; amount: number }): Bid {
    ensureSeed();
    const auction = getAuction(args.auctionId);
    if (!auction) throw new Error("Aukcja nie istnieje.");

    if (statusOf(auction.endAt) === "ended") throw new Error("Aukcja jest zakończona.");

    const bids = readJson<Bid[]>(BIDS_KEY, []);
    const current = listBids(args.auctionId).reduce((m, b) => Math.max(m, b.amount), auction.startingPrice);

    if (!args.bidderName.trim()) throw new Error("Podaj nazwę licytującego.");
    if (!Number.isFinite(args.amount) || args.amount <= current) {
        throw new Error(`Oferta musi być wyższa niż ${current}.`);
    }

    const bid: Bid = {
        id: nanoid(),
        auctionId: args.auctionId,
        bidderName: args.bidderName.trim(),
        amount: args.amount,
        createdAt: new Date().toISOString(),
    };

    writeJson(BIDS_KEY, [bid, ...bids]);
    return bid;
}
