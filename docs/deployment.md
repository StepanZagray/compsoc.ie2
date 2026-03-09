# Deployment (Cloudflare Pages)

The app is built with Vite (TanStack Start + Cloudflare plugin) and deployed with Wrangler to Cloudflare Pages.

## Local build & deploy

```bash
bun run build
bun run deploy   # runs: bun run build && wrangler deploy
```

Or with npm:

```bash
npm run build
npx wrangler deploy
```

## Cloudflare Pages (Git integration)

Recommended settings:

- **Build command:** `bun run build && npx wrangler deploy`  
  (or use separate Build + Deploy commands if your UI runs both in the same environment.)
- **Path / Root:** `/` (project root).
- **Non-production:** Optional. "Builds for non-production branches" with deploy command `npx wrangler versions upload` for previews.

If the build environment does not have Bun, use **Build command:** `npm run build && npx wrangler deploy` and ensure `package-lock.json` exists if you need reproducible installs.

## Config

- **Wrangler:** `wrangler.jsonc` — app name, compatibility date, `nodejs_compat`, main entry `@tanstack/react-start/server-entry`.
- **Vite:** `vite.config.ts` — TanStack Start, `@cloudflare/vite-plugin`, prerender enabled.

No build output directory is configured in the UI when using Wrangler for deploy; the build produces the artifact Wrangler expects and deploys it.
