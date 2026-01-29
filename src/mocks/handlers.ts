import { http, HttpResponse } from "msw";
import { createAuction, createBid, getAuction, listAuctions, listBids } from "../storage/db";
import type { Auction } from "../types";

export const handlers = [
    http.get("/api/auctions", () => {
        return HttpResponse.json(listAuctions());
    }),

    http.post("/api/auctions", async ({ request }) => {
        const body = (await request.json()) as Partial<Omit<Auction, "id" | "createdAt">>;

        if (!body.title || !body.description || !body.endAt || typeof body.startingPrice !== "number") {
            return HttpResponse.json({ message: "Niepoprawne dane aukcji." }, { status: 400 });
        }

        const endAtMs = new Date(body.endAt).getTime();
        if (!Number.isFinite(endAtMs) || endAtMs <= Date.now()) {
            return HttpResponse.json({ message: "Data zakończenia musi być w przyszłości." }, { status: 400 });
        }

        const auction = createAuction({
            title: body.title,
            description: body.description,
            images: body.images ?? [],
            startingPrice: body.startingPrice,
            endAt: body.endAt,
        });

        return HttpResponse.json(auction, { status: 201 });
    }),

    http.get<{ id: string }>("/api/auctions/:id", ({ params }) => {
        const auction = getAuction(params.id);
        if (!auction) return HttpResponse.json({ message: "Nie znaleziono aukcji." }, { status: 404 });
        return HttpResponse.json(auction);
    }),

    http.get<{ id: string }>("/api/auctions/:id/bids", ({ params }) => {
        return HttpResponse.json(listBids(params.id));
    }),

    http.post<{ id: string }>("/api/auctions/:id/bids", async ({ params, request }) => {
        const body = (await request.json()) as { bidderName?: string; amount?: number };

        try {
            const bid = createBid({
                auctionId: params.id,
                bidderName: body.bidderName ?? "",
                amount: Number(body.amount),
            });
            return HttpResponse.json(bid, { status: 201 });
        } catch (e) {
            const message = e instanceof Error ? e.message : "Błąd licytacji.";
            return HttpResponse.json({ message }, { status: 400 });
        }
    }),
];
