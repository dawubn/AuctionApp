import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAuctionApi, getAuctionApi, getAuctionsApi, getBidsApi, placeBidApi } from "../api/auctions";

export function useAuctions() {
    return useQuery({ queryKey: ["auctions"], queryFn: getAuctionsApi, staleTime: 60_000, });
}

export function useAuction(id: string) {
    return useQuery({ queryKey: ["auction", id], queryFn: () => getAuctionApi(id), staleTime: 60_000, });
}

export function useBids(id: string) {
    return useQuery({ queryKey: ["auction", id, "bids"], queryFn: () => getBidsApi(id), staleTime: 60_000 });
}

export function useCreateAuction() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: createAuctionApi,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["auctions"] }),
    });
}

export function usePlaceBid(auctionId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (payload: { bidderName: string; amount: number }) => placeBidApi(auctionId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["auctions"] });
            qc.invalidateQueries({ queryKey: ["auction", auctionId] });
            qc.invalidateQueries({ queryKey: ["auction", auctionId, "bids"] });
        },
    });
}
