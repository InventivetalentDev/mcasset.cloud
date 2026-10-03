# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Hosting notes (Cloudflare Pages)

The site is server-rendered by a Pages Function, which is billed as Workers CPU time.
A few things keep that bill in check; please keep them that way:

- `routeRules` in `nuxt.config.ts` has **no** `isr` / `swr` / `cache` entry. Nitro's `isr` is
  only implemented for Vercel/Netlify, and any of these options makes Nuxt extract the page
  payload into a separate `/_payload.json` request, which is answered by a second full
  server render on every page view (and the first render also has to serialise and keep
  the whole payload in memory for it).
- Large JSON (the version manifest, the version list and the per-version `_index.json`
  used by the search dialog) is fetched **client-side only** (`server: false`). Fetching it
  during SSR means parsing and serialising megabytes of JSON on every render.
- Nothing logs the render payload on the server. `console.log` of large objects costs CPU
  and Workers Logs events on every request.
- Rendered HTML is sent with `Cache-Control: public, max-age=300, s-maxage=3600` (set in
  `server/plugins/cache-headers.ts`, for successfully rendered pages only). Cloudflare
  does not cache HTML by default, so to actually serve repeat page views from the edge add a
  **Cache Rule** for the `mcasset.cloud` zone: match hostname `mcasset.cloud`, set
  *Eligible for cache*, and let the edge TTL follow the origin `Cache-Control` header.

