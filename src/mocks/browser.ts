// src/mocks/browser.ts
import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);

export function startWorker() {
    return worker.start({
        serviceWorker: {
            url: `${import.meta.env.BASE_URL}mockServiceWorker.js`,
            options: { scope: import.meta.env.BASE_URL },
        },
        onUnhandledRequest: "bypass",
    });
}
