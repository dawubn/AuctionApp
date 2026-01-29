import { Link } from "react-router-dom";
import type { AuctionListItem } from "../types";
import { Countdown } from "./Countdown";
import { useI18n } from "../i18n";

export function AuctionCard({ a }: { a: AuctionListItem }) {
    const cover = a.images[0];
    const { t } = useI18n();

    return (
        <Link to={`/auctions/${a.id}`} className="block rounded-2xl border hover:shadow-sm overflow-hidden">
            <div className="h-40 bg-black/5">
                {cover ? (
                    <img src={cover} alt="" className="h-40 w-full object-cover" />
                ) : (
                    <div className="h-40 w-full flex items-center justify-center text-sm opacity-60">{t("no_image")}</div>
                )}
            </div>

            <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-3">
                    <div className="font-semibold line-clamp-2">{a.title}</div>
                    <span className={`text-xs rounded-full px-2 py-1 border ${a.status === "active" ? "" : "opacity-60"}`}>
                        {a.status === "active" ? t("status_active") : t("status_ended")}
                    </span>
                </div>

                <div className="text-sm opacity-80 line-clamp-2">{a.description}</div>

                <div className="flex items-center justify-between text-sm">
                    <div>
                        <div className="text-xs opacity-70">{t("current_price")}</div>
                        <div className="font-medium">{a.currentPrice} zł</div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs opacity-70">{t("time_left")}</div>
                        <div className="font-medium"><Countdown endAt={a.endAt} /></div>
                    </div>
                </div>

                <div className="text-xs opacity-60">{t("bids_count", { count: a.bidsCount })}</div>
            </div>
        </Link>
    );
}
