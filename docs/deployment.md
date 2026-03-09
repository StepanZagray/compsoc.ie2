# Deployment (Cloudflare Pages, SSG)

The app is built as a **static site (SSG)**. Build output is **`dist/client`** — prerendered HTML and assets. No server, no Workers, no Wrangler. Cloudflare Pages serves the folder; static requests are [unlimited on the free plan](https://developers.cloudflare.com/pages/platform/limits/).

## Local build

```bash
bun run build
```

Or with npm:

```bash
npm run build
```

Output: **`dist/client`** (and `dist/server` / `.netlify` from the build pipeline; only `dist/client` is used for deploy).

## Cloudflare Pages (Git integration)

1. Connect the repo to Cloudflare Pages.
2. **Build settings:**
   - **Framework preset:** React (Vite) or None.
   - **Build command:** `bun run build` (or `npm run build` if Bun isn’t available).
   - **Build output directory:** `dist/client`
   - **Root directory:** `/` (or leave default).
3. Deploy. Pages will run the build and upload `dist/client`. No Wrangler, no API tokens.

If the build environment doesn’t have Bun, use **Build command:** `npm run build` and add a `package-lock.json` for reproducible installs.

## Config

- **Vite:** `vite.config.ts` — TanStack Start, **@netlify/vite-plugin-tanstack-start** (static build), prerender with `crawlLinks`. No Cloudflare plugin.
- **wrangler.jsonc** — Not used for this deploy; you can remove it or keep it for reference.
