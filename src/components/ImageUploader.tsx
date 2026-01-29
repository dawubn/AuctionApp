import { useMemo, useState } from "react";
import { useI18n } from "../i18n";

function isHttpUrl(s: string) {
    try {
        const u = new URL(s);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

function splitMany(input: string) {
    return input
        .split(/[\s,]+/g)
        .map((x) => x.trim())
        .filter(Boolean);
}

export function ImageUploader({
    images,
    onChange,
    max = 3,
}: {
    images: string[];
    onChange: (next: string[]) => void;
    max?: number;
}) {
    const [value, setValue] = useState("");
    const [error, setError] = useState<string | null>(null);
    const { t } = useI18n();

    const remaining = useMemo(() => Math.max(0, max - images.length), [max, images.length]);

    function addUrls(raw: string) {
        setError(null);

        const urls = splitMany(raw);
        if (urls.length === 0) return;

        const valid = urls.filter(isHttpUrl);
        if (valid.length === 0) {
            setError(t("error_invalid_link"));
            return;
        }

        const next = [...images];

        for (const u of valid) {
            if (next.length >= max) break;
            if (!next.includes(u)) next.push(u);
        }

        if (next.length === images.length) {
            if (images.length >= max) setError(t("error_limit_reached", { max }));
            else setError(t("error_links_exist"));
            return;
        }

        onChange(next);
        setValue("");
    }

    return (
        <div className="space-y-3">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                if (remaining > 0) addUrls(value);
                            }
                        }}
                        placeholder={t("paste_link_placeholder")}
                        className="block w-full rounded-xl border px-3 py-2 text-sm"
                        disabled={remaining === 0}
                    />

                    <button
                        type="button"
                        onClick={() => addUrls(value)}
                        disabled={remaining === 0}
                        className="rounded-xl border px-3 py-2 text-sm bg-white disabled:opacity-50"
                    >
                        {t("add")}
                    </button>

                    <div className="text-xs opacity-70 whitespace-nowrap">
                        {images.length}/{max}
                    </div>
                </div>

                <div className="text-xs opacity-70">{t("links_help")}</div>

                {error && <div className="text-sm text-red-600">{error}</div>}
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {images.map((src, idx) => (
                        <div key={src} className="relative">
                            <img
                                src={src}
                                alt=""
                                loading="lazy"
                                className="h-24 w-full rounded-xl object-cover border"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholder.png";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => onChange(images.filter((_, i) => i !== idx))}
                                className="absolute right-1 top-1 rounded-lg bg-white/90 px-2 py-1 text-xs border"
                            >
                                {t("remove")}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
