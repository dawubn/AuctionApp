import { useMemo, useState } from "react";
import { useI18n } from "../i18n";

export function BidForm({
    minAmount,
    disabled,
    onSubmit,
    isPending,
}: {
    minAmount: number;
    disabled: boolean;
    isPending: boolean;
    onSubmit: (v: { bidderName: string; amount: number }) => void;
}) {
    const [bidderName, setBidderName] = useState("");
    const [amount, setAmount] = useState<number>(minAmount + 1);
    const { t } = useI18n();

    const can = useMemo(() => {
        return !disabled && bidderName.trim().length > 0 && Number.isFinite(amount) && amount > minAmount;
    }, [disabled, bidderName, amount, minAmount]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (!can) return;
                onSubmit({ bidderName, amount });
            }}
            className="space-y-3"
        >
            <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1">
                    <div className="text-sm font-medium">{t("your_name")}</div>
                    <input
                        value={bidderName}
                        onChange={(e) => setBidderName(e.target.value)}
                        className="w-full rounded-xl border px-3 py-2"
                        placeholder={t("name_placeholder")}
                        disabled={disabled}
                    />
                </label>

                <label className="space-y-1">
                    <div className="text-sm font-medium">{t("amount_min", { minAmount })}</div>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full rounded-xl border px-3 py-2"
                        min={minAmount + 1}
                        disabled={disabled}
                    />
                </label>
            </div>

            <button
                type="submit"
                disabled={!can || isPending}
                className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
            >
                {isPending ? t("sending") : t("submit_bid")}
            </button>
        </form>
    );
}
