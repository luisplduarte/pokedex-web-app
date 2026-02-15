This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

Tests use [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/react) and [jsdom](https://github.com/jsdom/jsdom). Setup: `tests/setup.ts` (imports `@testing-library/jest-dom`); config: `vitest.config.ts` (environment `jsdom`, path alias `@` → `src`).

- **Run tests (watch):** `npm test`
- **Run once:** `npm run test:run`

## Build and deploy

- **Build:** `npm run build`. No environment variables are required. The app uses [PokéAPI](https://pokeapi.co/) with a fixed base URL in `src/lib/constants.ts`; share links use the current origin at runtime.
- **Deploy:** Standard Next.js deploy (e.g. Vercel). No `.env` or env vars needed for the default setup.

## Data fetching

List and detail data come from [PokéAPI](https://pokeapi.co/) via React Query. Defaults: `staleTime` 5 minutes, `retry: 1` on failure. Loading and error states use the shared `Spinner` and `ErrorMessage` components on all data pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
