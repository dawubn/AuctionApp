export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
    const res = await fetch(input, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
    });

    if (!res.ok) {
        let msg = `HTTP ${res.status}`;
        try {
            const data = (await res.json()) as { message?: string };
            if (data?.message) msg = data.message;
        } catch {
            throw new Error(msg);
        }
    }
    return (await res.json()) as T;
}
