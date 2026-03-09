# Docs

Documentation for the CompSoc.ie project. This folder is for humans and agents; **it is not part of the production build** (Vite only bundles `src/` and uses `public/`).

## Index

| Doc | Description |
|-----|-------------|
| [active-section-provider.md](active-section-provider.md) | How the active section context works (scroll, hover, tap, priority). |
| [project-structure.md](project-structure.md) | Directory layout, conventions, key files. |
| [design-tokens.md](design-tokens.md) | Section motion constants, CSS variables, keeping colors in sync. |
| [deployment.md](deployment.md) | Cloudflare Pages SSG: build command, output `dist/client`. |

## For agents

- Use **`#/`** for imports from `src/` (e.g. `#/components/ui/button`).
- **Active section:** See [active-section-provider.md](active-section-provider.md). Only one section is active; tap override lasts 0.5s then view-based logic applies.
- **Design tokens:** Changing section/nav border colors requires edits in both `src/constants/section-variants.ts` and `src/styles.css` — see [design-tokens.md](design-tokens.md).
- **UI components:** Base UI + CVA in `src/components/ui/`. For new shadcn-style components, use the command in `.cursorrules` (e.g. `pnpm dlx shadcn@latest add <component>`).
