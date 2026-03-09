# Active Section Provider

The **Active Section Provider** (`src/contexts/active-section.tsx`) is a React context that tracks which section of the page is currently "active." Only one section is active at a time. It drives:

- Hero, About, and Footer section styling (border color, opacity) via Motion
- Nav bar bottom border when the menu is active
- Hero typewriter and cursor state
- Mobile tap-to-active behavior

## Section IDs

```ts
export type SectionId = "hero" | "about" | "footer" | "menu"
```

## API

Consumers use the `useActiveSection()` hook (must be used inside `ActiveSectionProvider`):

| Member | Description |
|--------|-------------|
| `activeSectionId` | `SectionId \| null` — the section currently active |
| `registerSection(id, ref)` | Register a scroll-based section. Pass a ref to the section DOM node. Returns a cleanup function. |
| `setFooterHovered(hovered)` | Call with `true` when the footer is hovered, `false` when it isn’t. |
| `setMenuHovered(hovered)` | Call with `true` when the nav bar is hovered, `false` when it isn’t. |
| `setTapOverride(id)` | On mobile tap: make this section active for 0.5s, then revert to view-based logic. |

## Priority (who wins)

Active section is resolved in this order:

1. **Tap override** — If a section was recently tapped (within 0.5s), that section is active.
2. **Menu hover** — If the nav bar is hovered, `"menu"` is active.
3. **Footer hover** — If the footer is hovered, `"footer"` is active.
4. **Scroll** — Among **hero** and **about** only, the section with the **largest intersection ratio** is active. Hero must be ≥75% visible to stay active; below that, about can win.

Footer and menu do **not** participate in scroll-based activation; they are active only when hovered (or when tap override is set).

## Scroll-based registration

Sections that should compete by scroll (hero, about, footer for observation) call `registerSection(id, ref)` in a `useEffect`:

- The context adds the section to an `IntersectionObserver` with thresholds `[0, 0.1, …, 1]`.
- Each section’s latest `intersectionRatio` is stored.
- Cleanup (returned from `registerSection`) disconnects the observer and unregisters the section.

Only **hero** and **about** are used in the "best ratio" calculation; footer is observed but its ratio is ignored for active-section logic.

## Mobile tap behavior

- Hero, About, Footer, and the nav bar use `onTouchEnd` to call `setTapOverride("hero")`, `setTapOverride("about")`, etc.
- For **500ms** after a tap, that section stays active regardless of scroll/hover.
- When the timeout fires, `tapOverrideId` is cleared and **menu/footer hover state is also cleared** so they don’t stay active due to synthetic pointer events on touch devices.
- After that, the normal view-based logic (scroll + hover) decides the active section again.

## Where it’s used

- **Root layout** — `ActiveSectionProvider` wraps the app in `src/routes/__root.tsx`.
- **HeroSection** — Registers `"hero"`, uses `activeSectionId === "hero"` for motion and typewriter, calls `setTapOverride("hero")` on touch.
- **AboutSection** — Registers `"about"`, uses `activeSectionId === "about"` for motion, calls `setTapOverride("about")` on touch.
- **Footer** — Registers `"footer"`, uses `setFooterHovered` and `setTapOverride("footer")`.
- **Navigation bar** — Uses `setMenuHovered` and `setTapOverride("menu")`, and `activeSectionId === "menu"` for bottom border color.

## Constants

- **Tap duration:** `TAP_ACTIVE_MS = 500` in `active-section.tsx`.
- **Hero threshold:** Hero’s ratio is treated as 0 when &lt; 0.75 so about can become active (see `effective` in the effect).

## Adding a new section that uses active state

1. Add a new `SectionId` in `src/contexts/active-section.tsx` and extend the context logic if needed (scroll vs hover vs tap).
2. Use `sectionVariants` from `src/constants/section-variants.ts` for the section’s motion (and optionally `sectionActiveBorderColor` for a nav-like border).
3. Don’t introduce new hardcoded colors for the same active/inactive effect; reuse the constants so they stay in sync with CSS.
