# Pokédex Web App

A frontend-only Pokédex: browse Pokémon from [PokéAPI](https://pokeapi.co/), catch and release them, add notes, filter/sort, export to CSV, and share links. State is persisted in `localStorage`; the app works offline for previously loaded data and for catch/remove/notes.

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | [Next.js](https://nextjs.org) 16 (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 |
| Global state | [Zustand](https://github.com/pmndrs/zustand) (caught list, notes) |
| Server data | [TanStack React Query](https://tanstack.com/query/latest) (list + detail from PokéAPI) |
| Table (Pokedex view) | [TanStack Table](https://tanstack.com/table/latest) |
| Icons | [Lucide React](https://lucide.dev) |
| Testing | [Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react) + [jsdom](https://github.com/jsdom/jsdom) |

**Why we use these:** Next.js gives file-based routing and simple Vercel deploy; the app stays mostly client-side with room for SSR later. TypeScript and shared types keep API and store usage safe. Tailwind keeps styling local and responsive without a separate CSS system. Zustand holds the single source of truth for caught list and notes with minimal boilerplate. React Query handles all PokéAPI data (caching, loading, errors, retries) so we avoid ad-hoc fetch + state. TanStack Table powers only the Pokedex table with minimal column config. Vitest + RTL give fast, behavior-focused tests. We use no custom backend—PokéAPI + localStorage are enough for this scope. Full rationale and what we avoided are in [architecture.md](./architecture.md#tech-stack).

## Project Structure

- **`src/app/`** — Routes: home (list), `/pokedex` (caught only), `/pokemon/[id]` (detail).
- **`src/features/`** — Feature modules: pokemon (list, detail), pokedex (table, grid, progress, export), filters, notes, sharing.
- **`src/components/`** — Shared UI primitives, layouts, and providers (Query, Pokedex hydrate, Service Worker).
- **`src/services/`** — PokéAPI client, localStorage persistence, Pokémon cache for offline.
- **`src/store/`** — Zustand store (caught IDs, notes); persists via storage service.
- **`src/hooks/`** — `usePokemonList`, `usePokemonListInfinite`, `useOnlineStatus`.
- **`src/types/`**, **`src/lib/`**, **`src/utils/`** — Domain types, query client, constants, filter/sort and CSV helpers.

Details and layering (UI → hooks/state → services) are in [architecture.md](./architecture.md).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm test` | Run tests (watch) |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |

## Testing

Tests use **Vitest**, **React Testing Library**, and **jsdom**. Config: `vitest.config.ts` (environment `jsdom`, path alias `@` → `src`). Setup: `tests/setup.ts` (imports `@testing-library/jest-dom`).

- **Run (watch):** `npm test`
- **Run once:** `npm run test:run`

Critical paths covered: store (catch/remove/notes), filters/sort utils, notes UI, CSV export, share payload and button, catch/remove flows, FilterBar + list, detail page. See [architecture.md](./architecture.md#testing-strategy) for the critical-path → test file mapping.

## Data Fetching

List and detail come from PokéAPI via React Query. Defaults: `staleTime` 5 minutes, `retry: 1`. Loading and error states use shared `Spinner` and `ErrorMessage` on all data pages. When the API fails (e.g. offline), the app falls back to a localStorage Pokémon cache when available so previously visited list/detail and the Pokedex page can still show data.

## Build and Deploy

- **Build:** `npm run build`. No environment variables required; PokéAPI base URL is in `src/lib/constants.ts`; share links use the current origin at runtime.
- **Deploy:** Standard Next.js deploy (e.g. [Vercel](https://vercel.com)). No `.env` needed for the default setup.

## Documentation

- **[architecture.md](./architecture.md)** — Architecture decisions, folder structure, data model, layers, state design, offline/sync, testing strategy (including critical-path → test mapping), implementation scope, and **suggested future improvements**.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
