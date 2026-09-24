# Design Tokens & Animation

This doc is for developers and agents: where shared colors and motion values live, and how to keep them in sync so animations don’t flicker.

## Animation / transition timing

**Standard duration: 300 ms**

All UI transitions and animations use **300 ms** for consistency. Use this everywhere:

- **Tailwind:** `duration-300` (e.g. `transition-all duration-300`)
- **JS (`sectionVariants`, lazy `motion`):** `duration: 0.3` in `transition` objects
- **Custom CSS:** `transition-duration: 300ms` or `0.3s`

When adding new animated elements (hover states, section borders, nav, cards, menus), keep the duration at 300 ms unless there is a strong reason to deviate, and document it here.

## Section motion (active/inactive)

**File:** `src/constants/section-variants.ts`

Used by Hero, About, and Footer for border color and opacity. The **border colors are numeric values** so Motion can interpolate; they must match the theme used in CSS.

- **Active:** `borderColor: "oklch(0.746 0.16 232.661)"`, `opacity: 1` (matches `.dark` `--border-accent`)
- **Inactive:** `borderColor: "oklch(0.278 0.033 256.848)"`, `opacity: 0.7` (matches `--border`)
- **Transition:** `duration: 0.3` (300 ms), `ease: [0.25, 0.1, 0.25, 1]`
- **Nav active border:** `sectionActiveBorderColor` is the same as the active border color (re-exported for the nav bar).

## CSS variables that must stay in sync

**File:** `src/styles.css`

Comments in `styles.css` mark variables that are mirrored in `section-variants.ts`:

- **Active border (section/nav):** `--border-accent` in both `:root` and `.dark` → same as `sectionVariants.active.borderColor`.
- **Inactive border:** `.dark` `--border` → same as `sectionVariants.inactive.borderColor`.

**Rule:** When changing active/inactive border colors, update both:

1. `src/constants/section-variants.ts` (active/inactive `borderColor`)
2. `src/styles.css` (`--border-accent` and, for inactive, `.dark` `--border`)

Otherwise the animated sections will jump or flicker because Motion interpolates between the constants while CSS uses different values.



## First-load intro, CSS animation and lazy motion

**Files:** `src/styles.css` (bottom), `src/components/sections/Home/HeroSection.tsx`, `src/hooks/useLogoFlight.ts`, `src/components/ui/count-up.tsx`, `src/lib/motion.ts`

The home page is modelled on a riced Hyprland desktop:
- The hero is a terminal window tiled over a wallpaper (the campus photo), which shows through the 1rem gaps and the blur. It shows fastfetch-style output: the logo as pixel art, `compsoc@galway`, the headline and the buttons.
- Every section is a window.

The first-load intro is CSS only and plays straight from the prerendered HTML, before any JS runs:

| ms | What happens |
|---|---|
| 0 | Nav bar slides down (Hyprland layer "slide") |
| 60 | Terminal window pops in: scale 0.85 → 1 with Hyprland's overshoot bezier (`--ease-popin`) |
| 500 | `compsoc` is typed at the prompt, one cell per keystroke |
| 780 | Output prints row by row, instantly like stdout: `--row` × `--intro-row` (18 ms) |
| ~900 | Buttons are uncovered by the CTA's skewed slab sweeping across them (`--sweep-row`) |

- Scrolling is locked (`overflow: hidden` on `html`) until 1500 ms.
- Terminal text never fades or slides: it is either typed or printed. Keep it that way.
- `.intro` is only rendered in the hero's hydration render (`useIsHydrating()`), so it matches the server HTML and never replays after client-side navigation.
- Everything is inside `@media (prefers-reduced-motion: no-preference)`.
- Windows further down (About rows, Stats, Footer) have `.scroll-window`: a native scroll-driven animation (`animation-timeline: view()`) pops them in from 80% with a fade, anchored at the top edge, finishing when the top edge is 20vh into view (the footer, `.scroll-window-late`: 5vh). Without `animation-timeline` support they're simply shown.

The logo art is generated: `python3 scripts/ascii-logo.py 24` writes `src/components/sections/Home/ascii-logo.ts` from `compsoc_logo.png`. The hero draws it as SVG pixels on a 0.6em × 1em cell grid (block glyphs leave seams).

**CSS first.** Everything that can be CSS is CSS:
- The intro, the window pop-ins (scroll-driven), the mobile menu.
- `CountUp` (`src/components/ui/count-up.tsx`): a registered `@property --count` integer animates from 0 to `--to` and is printed through a CSS counter, so the number renders without JS. JS only arms it at 0 while off screen and starts it at 60% visible. CSS counters can't insert thousands separators, so it shows `1388`; screen readers and print get `1,388`.
- `useLogoFlight()` (run by the hero) needs JS for geometry but no library: a rAF-throttled scroll listener scrubs a shared-element transition. The hero logo arcs into the bar's empty icon slot (sideways and shrinking early, then straight up, so it never crosses the always-visible wordmark) and swaps for the bar icon as it lands. Before hydration and under reduced motion, `.nav-logo[data-hero-top] img` hides the bar icon at the hero and shows it once the hero isn't active.

**Motion only where CSS can't:** springs that follow the pointer and keep their momentum when retargeted.
- `useMagnetic()` pulls the hero buttons toward the pointer. Mouse/trackpad only, kept small so the buttons never overlap.
- The wallpaper's pointer parallax, on `(hover: hover) and (pointer: fine)` only.

Motion is **never imported statically**. Use `loadMotion()` from `src/lib/motion.ts`,
which dynamically imports `src/lib/motion-exports.ts`. Export only what you use
from that file: a bare `import("motion")` can't be tree-shaken and grows the
chunk to ~47 KB gzipped. The hero starts fetching it on mount, during the intro.

Measured options (home page, gzip) for reference:

| Approach | Eager | Lazy |
|---|---|---|
| `motion.div` from `motion/react` | +39.6 KB | – |
| `LazyMotion` + `domAnimation` (sync) | +26.6 KB | – |
| `LazyMotion` + async `domAnimation` | +14.5 KB | 14.5 KB |
| `LazyMotion` + async `domMax` | +14.4 KB | 27.9 KB |
| `React.lazy` island using `motion/react` | +0.2 KB | 39.4 KB |
| `import("motion")` → `animate` (used) | +0.1 KB | 18.8 KB |
| `import("motion/mini")` → `animate` (WAAPI only, no springs/JS values) | +0.1 KB | ~3.7 KB |

For layout/presence animations (`layoutId`, `AnimatePresence`) on a single
route, use a `React.lazy` island on that route rather than `LazyMotion` at the root.
