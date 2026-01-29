import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUploader } from "../components/ImageUploader";
import { useCreateAuction } from "../hooks/auctions";
import { useI18n } from "../i18n";

export function CreateAuction() {
    const nav = useNavigate();
    const { mutateAsync, isPending, error } = useCreateAuction();
    const { t, te } = useI18n();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startingPrice, setStartingPrice] = useState<number>(10);
    const [endAt, setEndAt] = useState("");
    const [images, setImages] = useState<string[]>([]);

    const endAtIso = useMemo(() => {
        if (!endAt) return null;
        const d = new Date(endAt);
        return Number.isNaN(d.getTime()) ? null : d.toISOString();
    }, [endAt]);

    const can =
        title.trim().length >= 3 &&
        description.trim().length >= 10 &&
        Number.isFinite(startingPrice) &&
        startingPrice > 0 &&
        !!endAtIso;

    async function submit() {
        if (!endAtIso) return;

        await mutateAsync({
            title: title.trim(),
            description: description.trim(),
            images, // <-- tu są linki URL
            startingPrice,
            endAt: endAtIso,
        });

        nav("/auctions");
    }

    return (
        <div className="max-w-2xl space-y-5">
            <h2 className="text-xl font-semibold">{t("create_title")}</h2>

            {error && (
                <div className="text-red-600">{t("error_prefix", { message: te((error as Error).message) })}</div>
            )}

            <div className="grid gap-3">
                <label className="space-y-1">
                    <div className="text-sm font-medium">{t("label_title")}</div>
                    <input
                        className="w-full rounded-xl border px-3 py-2"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </label>

                <label className="space-y-1">
                    <div className="text-sm font-medium">{t("label_description")}</div>
                    <textarea
                        className="w-full rounded-xl border px-3 py-2 min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </label>

                <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-1">
                        <div className="text-sm font-medium">{t("label_starting_price")}</div>
                        <input
                            type="number"
                            className="w-full rounded-xl border px-3 py-2"
                            value={startingPrice}
                            min={1}
                            onChange={(e) => setStartingPrice(Number(e.target.value))}
                        />
                    </label>

                    <label className="space-y-1">
                        <div className="text-sm font-medium">{t("label_end_date")}</div>
                        <input
                            type="datetime-local"
                            className="w-full rounded-xl border px-3 py-2"
                            value={endAt}
                            onChange={(e) => setEndAt(e.target.value)}
                        />
                        {!endAtIso && endAt.length > 0 && (
                            <div className="text-xs text-red-600">{t("invalid_date")}</div>
                        )}
                    </label>
                </div>

                <div className="space-y-1">
                    <div className="text-sm font-medium">{t("label_images")}</div>
                    <ImageUploader images={images} onChange={setImages} />
                </div>

                <button
                    type="button"
                    onClick={submit}
                    disabled={!can || isPending}
                    className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
                >
                    {isPending ? t("submitting") : t("publish")}
                </button>
            </div>
        </div>
    );
}
