# Discover Halal Stores

Find, explore and rate halal restaurants and stores near you.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** and **SWR**. Store data comes from the [Foursquare Places API](https://developer.foursquare.com), photos from [Unsplash](https://unsplash.com/developers), and ratings are persisted in [Convex](https://convex.dev).

## Features

- 🔍 Find halal stores near your current location (browser geolocation)
- 🏙️ Featured stores rendered server-side (ISR with 1h revalidation)
- ⭐ Rate stores — ratings are stored in Convex
- 📱 Responsive, accessible UI built with Tailwind
- 🔐 All API keys stay server-side; nothing is exposed to the client
- 🛡️ Typed API route handlers with input validation and proper error responses

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your keys
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Description |
| --- | --- |
| `FOURSQUARE_API_KEY` | Foursquare Places API key |
| `UNSPLASH_ACCESS_KEY` | Unsplash access key for store photos |



## Backend (Convex)

Store records and ratings live in [Convex](https://convex.dev) (`convex/schema.ts`). `npm run dev` starts both the Convex watcher and the Next.js dev server. The first run provisions a deployment automatically; for production, deploy with `npx convex deploy` and link a project via `npx convex login`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Convex watcher + Next.js dev server |
| `npm run build` / `npm start` | Production build & serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |

## License

[MIT](LICENSE)
