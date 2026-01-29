import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type Language = "pl" | "en";

type MessageKey =
    | "app_name"
    | "nav_home"
    | "nav_auctions"
    | "nav_create"
    | "language_toggle"
    | "home_title"
    | "home_description"
    | "home_cta_create"
    | "home_cta_auctions"
    | "loading"
    | "error_prefix"
    | "auctions_title"
    | "show_ended"
    | "empty_list"
    | "create_title"
    | "label_title"
    | "label_description"
    | "label_starting_price"
    | "label_end_date"
    | "invalid_date"
    | "label_images"
    | "submitting"
    | "sending"
    | "publish"
    | "not_found"
    | "back"
    | "no_images"
    | "description"
    | "current_price"
    | "time_left"
    | "status_active"
    | "status_ended"
    | "bid_section"
    | "bid_closed"
    | "bid_history"
    | "no_bids"
    | "bids_count"
    | "no_image"
    | "your_name"
    | "name_placeholder"
    | "amount_min"
    | "submit_bid"
    | "paste_link_placeholder"
    | "add"
    | "links_help"
    | "error_invalid_link"
    | "error_limit_reached"
    | "error_links_exist"
    | "remove";

type Messages = Record<Language, Record<MessageKey, string>>;

const messages: Messages = {
    pl: {
        app_name: "AuctionApp",
        nav_home: "Start",
        nav_auctions: "Aukcje",
        nav_create: "Wystaw",
        language_toggle: "PL/EN",
        home_title: "Aplikacja aukcyjna",
        home_description:
            "Wystaw przedmiot, ustaw czas zakończenia i pozwól innym licytować. Bez serwera — dane trzymane lokalnie.",
        home_cta_create: "Wystaw aukcję",
        home_cta_auctions: "Zobacz aukcje",
        loading: "Ładowanie...",
        error_prefix: "Błąd: {message}",
        auctions_title: "Aukcje",
        show_ended: "Pokaż zakończone",
        empty_list: "Brak aukcji do wyświetlenia.",
        create_title: "Wystaw aukcję",
        label_title: "Tytuł",
        label_description: "Opis",
        label_starting_price: "Cena startowa (zł)",
        label_end_date: "Koniec aukcji",
        invalid_date: "Niepoprawna data.",
        label_images: "Zdjęcia (linki)",
        submitting: "Dodawanie...",
        sending: "Wysyłanie...",
        publish: "Opublikuj aukcję",
        not_found: "Nie znaleziono aukcji.",
        back: "Wróć",
        no_images: "Brak zdjęć",
        description: "Opis",
        current_price: "Aktualna cena",
        time_left: "Do końca",
        status_active: "aktywna",
        status_ended: "zakończona",
        bid_section: "Licytuj",
        bid_closed: "Aukcja zakończona — nie można składać ofert.",
        bid_history: "Historia ofert",
        no_bids: "Brak ofert.",
        bids_count: "Ofert: {count}",
        no_image: "Brak zdjęcia",
        your_name: "Twoja nazwa",
        name_placeholder: "np. Janek",
        amount_min: "Kwota (min > {minAmount})",
        submit_bid: "Złóż ofertę",
        paste_link_placeholder: "Wklej link do zdjęcia (http/https)…",
        add: "Dodaj",
        links_help: "Możesz wkleić kilka linków naraz (oddzielone spacją, przecinkiem lub nową linią).",
        error_invalid_link: "Wklej poprawny link (http/https) do obrazka.",
        error_limit_reached: "Osiągnięto limit {max} zdjęć.",
        error_links_exist: "Linki już istnieją na liście lub przekroczono limit.",
        remove: "Usuń",
    },
    en: {
        app_name: "AuctionApp",
        nav_home: "Home",
        nav_auctions: "Auctions",
        nav_create: "Create",
        language_toggle: "PL/EN",
        home_title: "Auction app",
        home_description:
            "List an item, set an end time, and let others bid. No server — data is stored locally.",
        home_cta_create: "Create auction",
        home_cta_auctions: "Browse auctions",
        loading: "Loading...",
        error_prefix: "Error: {message}",
        auctions_title: "Auctions",
        show_ended: "Show ended",
        empty_list: "No auctions to display.",
        create_title: "Create auction",
        label_title: "Title",
        label_description: "Description",
        label_starting_price: "Starting price (PLN)",
        label_end_date: "Auction ends",
        invalid_date: "Invalid date.",
        label_images: "Images (links)",
        submitting: "Submitting...",
        sending: "Sending...",
        publish: "Publish auction",
        not_found: "Auction not found.",
        back: "Back",
        no_images: "No images",
        description: "Description",
        current_price: "Current price",
        time_left: "Time left",
        status_active: "active",
        status_ended: "ended",
        bid_section: "Place a bid",
        bid_closed: "Auction ended — bidding is closed.",
        bid_history: "Bid history",
        no_bids: "No bids.",
        bids_count: "Bids: {count}",
        no_image: "No image",
        your_name: "Your name",
        name_placeholder: "e.g. Jane",
        amount_min: "Amount (min > {minAmount})",
        submit_bid: "Place bid",
        paste_link_placeholder: "Paste image link (http/https)…",
        add: "Add",
        links_help: "You can paste multiple links at once (space, comma, or newline separated).",
        error_invalid_link: "Paste a valid image link (http/https).",
        error_limit_reached: "Reached the limit of {max} images.",
        error_links_exist: "Links already exist on the list or the limit was exceeded.",
        remove: "Remove",
    },
};

type I18nContextValue = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: MessageKey, vars?: Record<string, string | number>) => string;
    te: (message: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, vars?: Record<string, string | number>) {
    if (!vars) return template;
    return template.replace(/\{(\w+)\}/g, (match, key) => {
        const value = vars[key];
        return value === undefined ? match : String(value);
    });
}

function getInitialLang(): Language {
    if (typeof window === "undefined") return "en";
    const stored = window.localStorage.getItem("lang");
    if (stored === "pl" || stored === "en") return stored;
    const browser = window.navigator.language?.toLowerCase() ?? "";
    return browser.startsWith("pl") ? "pl" : "en";
}

function translateError(message: string, lang: Language) {
    const text = message.trim();
    if (lang === "en") {
        if (text === "Aukcja jest zakończona.") return "Auction has ended.";
        if (text === "Podaj nazwę licytującego.") return "Enter bidder name.";
        if (text === "Data zakończenia musi być w przyszłości.") return "End date must be in the future.";
        if (text === "Błąd licytacji.") return "Bidding error.";
        if (text.startsWith("Oferta musi być wyższa niż ")) {
            const value = text.replace("Oferta musi być wyższa niż ", "").replace(/\.$/, "");
            return `Bid must be higher than ${value}.`;
        }
    }
    if (lang === "pl") {
        if (text === "Auction has ended.") return "Aukcja jest zakończona.";
        if (text === "Enter bidder name.") return "Podaj nazwę licytującego.";
        if (text === "End date must be in the future.") return "Data zakończenia musi być w przyszłości.";
        if (text === "Bidding error.") return "Błąd licytacji.";
        if (text.startsWith("Bid must be higher than ")) {
            const value = text.replace("Bid must be higher than ", "").replace(/\.$/, "");
            return `Oferta musi być wyższa niż ${value}.`;
        }
    }
    return message;
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(getInitialLang);

    const setLang = (next: Language) => {
        setLangState(next);
        if (typeof window !== "undefined") {
            window.localStorage.setItem("lang", next);
        }
    };

    const value = useMemo<I18nContextValue>(() => {
        return {
            lang,
            setLang,
            t: (key, vars) => {
                const template = messages[lang][key] ?? messages.en[key] ?? key;
                return interpolate(template, vars);
            },
            te: (message) => translateError(message, lang),
        };
    }, [lang]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
}
