import { useMemo, useState } from "react";
import { useAuctions } from "../hooks/auctions";
import { AuctionCard } from "../components/AuctionCard";
import { useI18n } from "../i18n";

export function AuctionsList() {
    const { data, isLoading, error } = useAuctions();
    const [showEnded, setShowEnded] = useState(false);
    const { t, te } = useI18n();

    const filtered = useMemo(() => {
        const arr = data ?? [];
        return showEnded ? arr : arr.filter((a) => a.status === "active");
    }, [data, showEnded]);

    console.log("showEnded", showEnded, "sample", data?.[0]);

    if (isLoading) return <div>{t("loading")}</div>;
    if (error) {
        return <div className="text-red-600">{t("error_prefix", { message: te((error as Error).message) })}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold">{t("auctions_title")}</h2>
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />
                    {t("show_ended")}
                </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((a) => (
                    <AuctionCard key={a.id} a={a} />
                ))}
            </div>

            {filtered.length === 0 && <div className="opacity-70">{t("empty_list")}</div>}
        </div>
    );
}
