import { Link } from "react-router-dom";
import { useI18n } from "../i18n";

export function Home() {
    const { t } = useI18n();

    return (
        <div className="rounded-3xl border p-6 sm:p-10 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-semibold">{t("home_title")}</h1>
            <p className="opacity-80 max-w-2xl">
                {t("home_description")}
            </p>
            <div className="flex flex-wrap gap-3">
                <Link to="/create" className="rounded-xl bg-black text-white px-4 py-2">{t("home_cta_create")}</Link>
                <Link to="/auctions" className="rounded-xl border px-4 py-2">{t("home_cta_auctions")}</Link>
            </div>
        </div>
    );
}
