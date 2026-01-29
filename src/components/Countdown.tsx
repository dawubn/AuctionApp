import { useEffect, useMemo, useState } from "react";

function pad(n: number) {
    return String(n).padStart(2, "0");
}

export function Countdown({ endAt }: { endAt: string }) {
    const end = useMemo(() => new Date(endAt).getTime(), [endAt]);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(t);
    }, []);

    if (!Number.isFinite(end)) return <span>—</span>;

    const diffMs = Math.max(0, end - now);
    const totalSec = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    return (
        <span>
            {days > 0 ? `${days}d ` : ""}
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
        </span>
    );
}
