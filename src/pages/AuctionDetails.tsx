import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Countdown } from "../components/Countdown";
import { BidForm } from "../components/BidForm";
import { useAuction, useBids, usePlaceBid } from "../hooks/auctions";
import { useI18n } from "../i18n";

export function AuctionDetails() {
    const { id = "" } = useParams();
    const auctionQ = useAuction(id);
    const bidsQ = useBids(id);
    const bidM = usePlaceBid(id);
    const { t, te } = useI18n();

    const auction = auctionQ.data;
    const bids = useMemo(() => bidsQ.data ?? [], [bidsQ.data]);

    const currentPrice = useMemo(() => {
        if (!auction) return 0;
        return bids.reduce((m, b) => Math.max(m, b.amount), auction.startingPrice);
    }, [auction, bids]);

    const ended = auction ? Date.now() >= new Date(auction.endAt).getTime() : false;

    if (auctionQ.isLoading) return <div>{t("loading")}</div>;
    if (auctionQ.error) {
        return (
            <div className="text-red-600">
                {t("error_prefix", { message: te((auctionQ.error as Error).message) })}
            </div>
        );
    }
    if (!auction) return (
        <div>
            {t("not_found")} <Link className="underline" to="/auctions">{t("back")}</Link>
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{auction.title}</h2>
                <Link to="/auctions" className="text-sm underline">← {t("nav_auctions")}</Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                    {auction.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                            {auction.images.length > 0 ? (
                                <div className="grid grid-cols-2 gap-2">
                                    {auction.images.map((src) => (
                                        <img
                                            key={src}
                                            src={src}
                                            alt=""
                                            loading="lazy"
                                            className="h-40 w-full rounded-2xl border object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "/placeholder.png";
                                            }}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="h-48 rounded-2xl border bg-black/5 flex items-center justify-center opacity-60">
                                    {t("no_images")}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-48 rounded-2xl border bg-black/5 flex items-center justify-center opacity-60">
                            {t("no_images")}
                        </div>
                    )}

                    <div className="rounded-2xl border p-4 space-y-2">
                        <div className="text-sm opacity-70">{t("description")}</div>
                        <div className="whitespace-pre-wrap">{auction.description}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="rounded-2xl border p-4 space-y-2">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                                <div className="opacity-70">{t("current_price")}</div>
                                <div className="text-lg font-semibold">{currentPrice} zł</div>
                            </div>
                            <div className="text-right">
                                <div className="opacity-70">{t("time_left")}</div>
                                <div className="text-lg font-semibold"><Countdown endAt={auction.endAt} /></div>
                            </div>
                        </div>
                        <div className={`text-xs rounded-full inline-block px-2 py-1 border ${ended ? "opacity-60" : ""}`}>
                            {ended ? t("status_ended") : t("status_active")}
                        </div>
                    </div>

                    <div className="rounded-2xl border p-4 space-y-3">
                        <div className="font-semibold">{t("bid_section")}</div>

                        {bidM.error && (
                            <div className="text-red-600 text-sm">
                                {t("error_prefix", { message: te((bidM.error as Error).message) })}
                            </div>
                        )}

                        <BidForm
                            minAmount={currentPrice}
                            disabled={ended}
                            isPending={bidM.isPending}
                            onSubmit={(v) => bidM.mutate(v)}
                        />

                        {ended && <div className="text-sm opacity-70">{t("bid_closed")}</div>}
                    </div>

                    <div className="rounded-2xl border p-4 space-y-3">
                        <div className="font-semibold">{t("bid_history")}</div>
                        {bidsQ.isLoading ? (
                            <div>{t("loading")}</div>
                        ) : (
                            <ul className="space-y-2 text-sm">
                                {bids.length === 0 && <li className="opacity-70">{t("no_bids")}</li>}
                                {bids.map((b) => (
                                    <li key={b.id} className="flex items-center justify-between gap-3">
                                        <span className="opacity-80">{b.bidderName}</span>
                                        <span className="font-medium">{b.amount} zł</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
