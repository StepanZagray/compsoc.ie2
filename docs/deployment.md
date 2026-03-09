# Deployment (Cloudflare Pages, SSG)

The app is built as a **static site (SSG)**. Build output is **`dist/client`** — prerendered HTML and assets. Deploy with **Wrangler** (Cloudflare CLI). Static requests are [unlimited on the free plan](https://developers.cloudflare.com/pages/platform/limits/).

## Local build

```bash
bun run build
```

Output: **`dist/client`** (and `dist/server` / `.netlify` from the build pipeline; only `dist/client` is used for deploy).

## Cloudflare Pages (Git integration)

1. Connect the repo to Cloudflare Pages.
2. **Build settings:**
   - **Framework preset:** React (Vite) or None.
   - **Build command:** `bun run build` (or `npm run build` if Bun isn’t available).
   - **Build output directory:** `dist/client`
   - **Root directory:** `/` (or leave default).
3. Deploy. Pages runs the build and uploads `dist/client`.

If the build environment doesn’t have Bun, use **Build command:** `npm run build` and add a `package-lock.json` for reproducible installs.

## Deploy with Wrangler (CLI)

1. Install deps and log in once: `bunx wrangler login`
2. Build and deploy: `bun run deploy` (runs `build` then `wrangler pages deploy dist/client`)
3. First time: create project if needed: `bunx wrangler pages project create compsoc-ie` (match `name` in wrangler.jsonc)

## Config

- **Vite:** `vite.config.ts` — TanStack Start, **@netlify/vite-plugin-tanstack-start** (static build), prerender with `crawlLinks`.
- **wrangler.jsonc** — Cloudflare Pages: `name` (`compsoc-ie`), `pages_build_output_dir` = `./dist/client`. Used by `wrangler pages deploy` and by the dashboard when using the config file.
