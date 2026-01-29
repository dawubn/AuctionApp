# Auction App (React + TypeScript + TanStack Query)

Aplikacja do obsługi aukcji: przeglądanie listy aukcji, filtrowanie aktywnych/zakończonych, podgląd szczegółów, lista ofert, tworzenie aukcji oraz składanie ofert.

## Funkcje

- Lista aukcji (`AuctionsList`)
- Filtrowanie: tylko aktywne / pokaż zakończone
- Szczegóły aukcji (`useAuction(id)`)
- Lista ofert dla aukcji (`useBids(id)`)
- Tworzenie aukcji (`useCreateAuction`)
- Składanie oferty (`usePlaceBid(auctionId)`)
- Cache i refetch przez **@tanstack/react-query**
- Inwalidacja cache po mutacjach (odświeżanie listy i szczegółów)

## Stack technologiczny

- React + TypeScript
- Tailwind CSS
- @tanstack/react-query
- React Router
- API: moduł `src/api/auctions`

## Wymagania

- Node.js 18+ (zalecane)
- npm / pnpm / yarn

## Instalacja i uruchomienie

1. Instalacja zależności:
   ```bash
   npm install
   ```
2. Start w trybie developerskim:
 ```bash
   npm run dev
   ```
2. Utworzenie build produkcyjnego:
 ```bash
   npm run buil
   ```
3. Start w trybie preview:
 ```bash
   npm run prev
   ```

## Konfiguracja API (opcjonalnie)
Jeśli API działa pod innym adresem niż domyślny, dodaj zmienną środowiskową.

## Struktura projektu
```swift
src/
  api/
    auctions.ts        # funkcje getAuctionsApi/getAuctionApi/getBidsApi/createAuctionApi/placeBidApi
    client.ts
  hooks/
    auctions.ts        # useAuctions/useAuction/useBids/useCreateAuction/usePlaceBid
  components/
    AuctionCard.tsx
    BidForm.tsx
    Countdown.tsx
    ImageUploader.tsx
    Layout.tsx
  pages/
    AuctionList.tsx
    AuctionDetails.tsx
    CreateAuction.tsx
    Home.tsx
  storage/
    db.ts
```
## Hooki

1. useAuctions()
Pobiera listę aukcji:
```ts
useQuery({ queryKey: ["auctions"], queryFn: getAuctionsApi })
```

2. useAuction(id)
Pobiera szczegóły jednej aukcji:
```ts
useQuery({ queryKey: ["auction", id], queryFn: () => getAuctionApi(id) })
```

3. useBids(id)
Pobiera oferty dla aukcji:
```ts
useQuery({ queryKey: ["auction", id, "bids"], queryFn: () => getBidsApi(id) })
```

4. useCreateAuction()
Tworzy aukcję i odświeża listę:

```ts
useMutation({
  mutationFn: createAuctionApi,
  onSuccess: () => qc.invalidateQueries({ queryKey: ["auctions"] }),
})
```

5. usePlaceBid(auctionId)
Składa ofertę i odświeża listę, szczegóły i oferty:

```ts
useMutation({
  mutationFn: (payload) => placeBidApi(auctionId, payload),
  onSuccess: () => {
    qc.invalidateQueries({ queryKey: ["auctions"] });
    qc.invalidateQueries({ queryKey: ["auction", auctionId] });
    qc.invalidateQueries({ queryKey: ["auction", auctionId, "bids"] });
  },
})
```