# Architecture

This document describes the architecture decisions and structure of the Pokédex web app. The app is deployed at [https://pokedex-web-app-bice.vercel.app/](https://pokedex-web-app-bice.vercel.app/).

## Overview

- **Frontend-only**: No custom backend. Data comes from [PokéAPI](https://pokeapi.co/) and user state from `localStorage`.
- **Feature-based**: Code is organized by feature (pokemon, pokedex, filters, notes, sharing). Features do not import from other features’ internals; they use shared `components/`, `store/`, `services/`, `hooks/`, and `types/`.
- **Layered**: UI → hooks/state → services. Components never call `localStorage` or `fetch` directly.

## Tech Stack

| Area | Choice | Rationale |
|------|--------|-----------|
| Framework | Next.js (App Router) | File-based routing, Vercel-friendly deploy, clear layout/loading boundaries. App is mostly client-side; room to add SSR or API routes later if needed. |
| Language | TypeScript | Typed API responses, store state, and props; domain types in `types/` reduce runtime errors. |
| Styling | Tailwind CSS | Utility-first, responsive without a separate CSS layer. Small set of reusable UI components on top; no full design system. |
| Global state | Zustand | Single store for caught list and notes. Minimal API, little boilerplate, good TypeScript support. |
| Server data | TanStack React Query | All PokéAPI data (list and detail). Caching, loading/error, retries. Stale-while-revalidate fits “browse Pokémon” usage. |
| Persistence | localStorage via service | One key, one JSON payload. Read/write only in `services/storage.ts`; store subscribes and saves on change, hydrates on init. |
| Testing | Vitest + React Testing Library | Fast runner, ESM-friendly. Behavior-focused tests; critical paths covered (store, filters, notes, export, share, catch/remove). |
| Table view | TanStack Table | Used only on the Pokédex page for the caught-Pokémon table. Column definitions stay minimal. |

## What We Avoided

- **Custom backend** — PokéAPI + localStorage are enough for the scope.
- **Redux** — One small store; Zustand is sufficient.
- **Direct fetch/useState for API** — React Query centralizes caching and loading/error.
- **localStorage in components or store** — Encapsulated in `storage` service for testability and future schema changes.

## Folder Structure

```
src/
├── app/                    # Routes (App Router)
│   ├── layout.tsx          # Root layout: providers, OfflineIndicator, fonts
│   ├── page.tsx            # Home: all Pokémon list + filters
│   ├── pokedex/page.tsx    # My Pokédex (caught only, table/grid, export)
│   └── pokemon/[id]/page.tsx  # Pokémon detail
├── components/
│   ├── ui/                 # Generic primitives (Button, Card, Spinner, ErrorMessage, etc.)
│   ├── layouts/            # MainLayout, PageHeader
│   └── providers/          # QueryProvider, PokedexHydrate, ServiceWorkerRegister
├── features/
│   ├── pokemon/            # List, list item, detail, usePokemonDetail
│   ├── pokedex/            # Table, card grid, view toggle, progress, export UI
│   ├── filters/            # FilterBar, useFilters (URL-synced)
│   ├── notes/              # PokemonNote (textarea bound to store)
│   └── sharing/            # SharePokemonButton, sharePayload, copyToClipboard
├── hooks/                  # usePokemonList, usePokemonListInfinite, useOnlineStatus
├── services/               # pokeapi, storage, pokemonCache (offline fallback)
├── store/                  # pokedexStore (Zustand)
├── lib/                    # queryClient, constants
├── types/                  # pokemon, pokedex, api (API response shapes)
└── utils/                  # filters, csvExport, downloadCsv
```

Each feature exposes a public API via `index.ts`; pages and other features import from the feature entry (e.g. `@/features/pokemon`), not from internal paths.

## Data Model and API

### PokéAPI

- **List**: `GET .../pokemon?limit=N&offset=M` for id/name/url; we map to list items (id, name, imageUrl, types; image comes from detail or list response depending on endpoint).
- **Detail**: `GET .../pokemon/{id}` for a single Pokémon (stats, height, weight, types, sprites). Mapped to `PokemonDetail` in `types/pokemon.ts`.

### Domain types (`src/types/`)

- **Pokemon** (list item): `id`, `name`, `imageUrl`, `types[]`, optional `height`/`weight`.
- **PokemonDetail**: extends list item with required `height`, `weight`, `stats` (hp, attack, defense, special-attack, special-defense, speed).
- **CachedPokemon**: used when showing data from `pokemonCache` offline; stats optional.
- **PokedexPersistedState** (`types/pokedex.ts`): `caught: { pokemonId, caughtAt }[]`, optional `notes: Record<string, string>` (pokemonId → note). Single source of truth for “caught” and “note per Pokémon”.

### localStorage schema

Single key (`POKEDEX_STORAGE_KEY` in `lib/constants.ts`) with a JSON payload:

```ts
{
  caught: { pokemonId: number; caughtAt: string }[],
  notes?: Record<string, string>  // pokemonId -> note
}
```

`storage.load()` validates shape and returns `null` on invalid or missing data.

## Services Contract

- **pokeapi**: `fetchPokemonListPage(limit, offset)` and `fetchPokemonById(id)`. Pure functions returning promises; map API responses to `types/pokemon` and `types/api`. No React or hooks.
- **storage**: `load(): PokedexPersistedState | null`, `save(state): void`. Key and validation in one place; no direct `localStorage` anywhere else.
- **pokemonCache**: localStorage cache for list/detail used when API fails (offline). Populated on successful fetches; `getCachedPokemon(id)`, `getCachedPokemonMany(ids)`, `setCachedPokemon` / `setCachedPokemonMany`.

## Layers and Data Flow

1. **UI**  
   Pages and feature components render using props and hooks. They use shared UI components and layouts. No direct `fetch` or `localStorage`.

2. **Hooks & state**  
   - **React Query** (e.g. `usePokemonList`, `usePokemonDetail`): fetches from `services/pokeapi`, optional write to `pokemonCache` for offline.  
   - **Zustand** (`usePokedexStore`): caught IDs, caughtAt, notes. Store subscribes to changes and calls `storage.save()`; `PokedexHydrate` runs `storage.load()` and `hydrate()` on mount.  
   - **useFilters**: filter/sort state in URL search params (`q`, `types`, `sort`, `dir`, `minH`, `maxH`, etc.).  
   - **usePokedexViewMode**: table vs grid persisted in localStorage.

3. **Services**  
   - **pokeapi**: `fetchPokemonListPage`, `fetchPokemonById`. Pure functions; map API responses to `types/pokemon` and `types/api`.  
   - **storage**: `load()` / `save(PokedexPersistedState)`. Single key; validates shape on load.  
   - **pokemonCache**: localStorage cache of Pokémon list/detail for offline; used when API fails so list and detail pages can still show previously loaded data.

## State Design

- **Pokedex (user’s data)**  
  One Zustand store: `caughtIds`, `caughtAt`, `notes`; actions `addCaught`, `removeCaught`, `removeMany`, `setNote`, `getNote`, `hydrate`. Persisted as `PokedexPersistedState` (caught array + optional notes map).

- **Server data**  
  React Query only. List and detail keys; 5 min staleTime, retry 1. No global client state for “all Pokémon” or “current filters”—filters live in URL.

## Key Decisions

- **Filter/sort in URL** — Shareable and bookmarkable; no extra state layer.
- **Single storage key** — One JSON blob for caught + notes; schema validated in `storage.load()`.
- **Offline** — Service worker caches app routes for navigation; catch/remove/notes use localStorage only. When API fails, list/detail use `pokemonCache` when available; banner indicates “saved data / offline”.
- **Home list: paginated vs full** — Home can use `usePokemonList(limit)` or `usePokemonListInfinite()`. Filtering/sorting applies to the currently loaded set on the infinite-scroll home view; Pokédex page has full caught list so filter/sort apply to all caught Pokémon.
- **Suspense for useSearchParams** — Home and Pokedex pages wrap content that uses `useFilters()` (and thus `useSearchParams()`) in `<Suspense>` so static generation works.

## Filter/sort scope (home vs Pokedex)

On the **home page**, list data can be loaded via infinite scroll (`usePokemonListInfinite`, 20 per page). Filtering and sorting then apply only to the currently loaded set, not the full PokéAPI dataset. On the **Pokedex page**, all caught Pokémon are loaded upfront, so filter/sort apply to the full caught list. Loading the full 1350+ Pokémon on home would require many API calls and hurt performance; we trade “filter/sort over everything” on home for fast initial load.

## Offline and sync

- **User data (“mine”)**: localStorage via `storage` and Zustand store. Single device; “sync” = load from localStorage on init. No conflict resolution.
- **Server data (“all Pokémon”)**: PokéAPI; React Query caches in memory. When offline, list/detail and Pokedex can fall back to `pokemonCache` when available (populated as the user browses). Sharing is out-only: copy link or summary (clipboard / Web Share API); no import or merge.

## UX and view modes

- **Pokedex page**: Table (TanStack Table) or card grid; toggle persisted in localStorage. Same data; table for desktop, grid for touch-friendly use. Progress and filters visible in both.
- **Accessibility**: Focus order follows document order; icon-only buttons have `aria-label`; table headers `scope="col"`; FilterBar uses fieldset/legend and `aria-pressed` for type filters.

## Risks and trade-offs

- **PokéAPI rate limits**: Conservative caching (5 min staleTime) and limited concurrency; avoid loading full catalog in one go.
- **Home list**: Filter/sort over loaded subset only (see “Filter/sort scope” above).

## Implemented scope (vs original requirements)

- Filter/sort by name, type, height, weight, and timestamp (caughtAt). URL-synced params; FilterBar with min/max height and weight.
- Bulk remove: multi-select in table and card grid, “Remove selected” with confirmation; store has `removeMany(ids)`.
- Offline: offline indicator, service worker for route caching, `pokemonCache` so list/detail and Pokedex can show previously loaded data when API fails; catch/remove/notes always persist via localStorage.

## Testing Strategy

- **Unit**: Store (add/remove/notes, hydrate, offline persist), `utils/filters`, `utils/csvExport`, `sharePayload`, `storage` (load/save with mocks).
- **Integration**: List page (load, catch/release), detail page, FilterBar + list, CSV download, Share button (clipboard / navigator.share), offline indicator.
- Tests live next to code or in `app/*.test.tsx`; single setup in `tests/setup.ts`. We test behavior, not third-party internals.

**Critical path → test file mapping:**

| Critical path | Test(s) |
|---------------|--------|
| Store add/remove/notes | `store/pokedexStore.test.ts` |
| Filters/sort utils | `utils/filters.test.ts` |
| Notes UI | `features/notes/components/PokemonNote.test.tsx` |
| CSV export / download | `utils/csvExport.test.ts`, `utils/downloadCsv.test.ts` |
| Share payload / UI | `features/sharing/utils/sharePayload.test.ts`, `SharePokemonButton.test.tsx` |
| Catch/remove flow | `app/page.test.tsx`, `PokemonDetail.test.tsx` (onCatch/onRelease) |
| Filter bar + list | `features/filters/components/FilterBar.integration.test.tsx` |
| Detail page | `PokemonDetail.test.tsx`, `usePokemonDetail.test.ts` |
| Pokedex Export | `app/pokedex/page.test.tsx` |
| Storage | `services/storage.test.ts` |
| Offline indicator | `useOnlineStatus.test.ts`, `OfflineIndicator.test.tsx` |

## Future improvements

If I had more time, these are the improvements I would add to this project.

- **Skeleton loaders** — Replace generic `Spinner` on list and detail with content-shaped skeletons (card placeholders, stat bars). Improves perceived performance and layout stability (no content shift).
- **Optimistic updates** — On catch/release, update the UI immediately and roll back only on failure. Makes the app feel instant; Zustand + React Query invalidation can support this with little change.
- **Virtualized list** — For the home list (and optionally Pokedex when many caught), use a virtual list (e.g. TanStack Virtual or `react-window`) so only visible rows render. Helps with long lists and scroll performance.
- **Image optimization** — Use `next/image` for Pokémon sprites with `sizes` and optional `placeholder="blur"` or a small base64 placeholder to avoid layout shift and leverage lazy loading.
- **Dark/Light mode toggle** — Optional theme stored in localStorage.
- **E2E tests** — Add Cypress for a few critical flows: open list → catch → go to Pokedex → remove → export CSV. Catches integration and real browser behavior that unit/integration tests don’t.

## Implementation approach

The app was built in ordered phases: foundation (types, services, store, base UI) → list + React Query → catch/remove + Pokedex page → detail page → notes → filters/sort → table + grid + view mode → progress + CSV export → sharing → offline (indicator, SW, cache) → polish and testing audit. Dependencies were added as needed: Zustand (store), React Query (list/detail), TanStack Table (Pokedex table), Vitest + RTL + jsdom (tests).
