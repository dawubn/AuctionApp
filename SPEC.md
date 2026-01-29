# Specyfikacja Auction App 

## 1. Aplikacja webowa (SPA) do obsługi aukcji. 

Użytkownik może przeglądać listę aukcji pobieraną z API, filtrować aukcje aktywne/zakończone, przechodzić do szczegółów aukcji wraz z listą ofert, tworzyć nowe aukcje oraz składać oferty. Warstwa danych po stronie klienta wykorzystuje TanStack React Query (cache, refetch, mutacje), a „backend” projektu jest symulowany przez logikę opartą o localStorage (`src/storage/db.ts`) obsługiwaną przez endpointy `/api/...`.


## 2. Wymagania funkcjonalne

1. **Lista aukcji**: pobranie i wyświetlenie aukcji z API (`GET /api/auctions`).  
2. **Filtrowanie aukcji**: możliwość przełączenia „Pokaż zakończone” domyślnie widoczne tylko aukcje o `status === "active"`.  
3. **Szczegóły aukcji**: wyświetlenie szczegółów aukcji na podstawie parametru `:id` (`GET /api/auctions/:id`).  
4. **Lista ofert (bids)**: wyświetlenie listy ofert dla danej aukcji (`GET /api/auctions/:id/bids`).  
5. **Tworzenie aukcji**: formularz dodania aukcji i zapis poprzez API (`POST /api/auctions`).  
6. **Składanie oferty**: formularz złożenia oferty (`bidderName`, `amount`) dla aukcji (`POST /api/auctions/:id/bids`) wraz z walidacją biznesową (np. oferta wyższa od aktualnej, aukcja nie może być zakończona).

## 3. Wymagania pozafunkcjonalne

1) **Responsywność**: siatka listy aukcji działa poprawnie dla co najmniej 3 progów (np. `<640px`: 1 kolumna, `>=640px`: 2 kolumny, `>=1024px`: 3 kolumny).  
2) **Wydajność/UX**: cache i ponowne wykorzystanie danych z API (TanStack Query), stany ładowania/błędu, brak zbędnych zapytań dzięki `queryKey` oraz inwalidacji po mutacjach.  
(+) **Trwałość danych**: dane aukcji i ofert przechowywane są w localStorage.  
(+) **Dostępność**: semantyczne HTML, czytelne komunikaty błędów, elementy formularzy i kontrolki (checkbox) posiadają etykiety.

## 4. Potencjalni odbiorcy

- **Osoby chcące sprzedać przedmiot na aukcji** - w łatwy sposób moga wystawić przedmiot i ustawić koniec licytacji.  
- **Osoby szukające przedmiotu do zakupu** – szybki i łatwy przegląd ofert i moliwość wzięcia udziału w licytacji.

## 5. Korzyści dla użytkowników

- Możliwość **szybkiego przeglądania aukcji** oraz filtrowania aktywnych i zakończonych.  
- **Natychmiastowe odświeżanie UI** po dodaniu aukcji lub oferty (inwalidacja cache: lista + szczegóły + bids).  
- Dane nie znikają po refreshu dzięki **localStorage**.

## 6. Tech stack

- **React + TypeScript**  
- **React Router** (routing przez `createBrowserRouter`)  
- **TanStack React Query** (zapytania, cache, mutacje, invalidacje)  
- **Tailwind CSS** (UI / layout)

## 7. REST API

Warstwa API po stronie klienta (`src/api/auctions.ts`) korzysta z endpointów:

- `GET /api/auctions`: `getAuctionsApi()` - lista aukcji (typ: `AuctionListItem[]`)  
- `GET /api/auctions/:id`: `getAuctionApi(id)` - szczegóły aukcji (typ: `Auction`)  
- `POST /api/auctions`: `createAuctionApi(payload)` - tworzenie aukcji (typ: `Auction`)  
- `GET /api/auctions/:id/bids`: `getBidsApi(auctionId)` - lista ofert (typ: `Bid[]`)  
- `POST /api/auctions/:id/bids`: `placeBidApi(auctionId, payload) - utworzenie oferty (typ: `Bid`)

## 8. Trwałość danych

Dane przechowywane są w localStorage w module `src/storage/db.ts`:

- `auction-app:auctions` - lista aukcji  
- `auction-app:bids` - lista ofert

Mechanizmy:
- Seed danych startowych przy pierwszym uruchomieniu (`ensureSeed()`).  
- Status aukcji obliczany na podstawie `endAt` (`active` / `ended`).  
- Oferta jest walidowana: aukcja musi istnieć, nie może być zakończona, `bidderName` niepuste, `amount` > aktualnej ceny.

## 9. Routing (min. 2 elementy nawigacyjne)
Zdefiniowany w `router.tsx`:

- `/`: `Home`  
- `/auctions`: `AuctionsList`  
- `/auctions/:id`: `AuctionDetails`  
- `/create`: `CreateAuction`

Nawigacja minimalna (w `Layout`):
- Link do **Home**  
- Link do **Aukcje** (`/auctions`)  
- Link do **Utwórz aukcję** (`/create`)  
