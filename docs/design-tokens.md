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



## First-load intro and lazy motion

**Files:** `src/styles.css` (bottom), `src/components/sections/Home/HeroSection.tsx`, `src/hooks/useScrollWindow.ts`, `src/lib/motion.ts`

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
- `.intro` is only rendered the first time the hero renders in a page load.
- Everything is inside `@media (prefers-reduced-motion: no-preference)`.
- Windows further down (About, Stats, Footer) use `useScrollWindow()`. Once motion has loaded, it ties a Hyprland-style popin (80% scale plus fade, anchored at the top edge) to scroll, finishing when the window top reaches 80% down the viewport (the footer: 95%), with motion's `scroll()`, and reverses when scrolled back. Until then the windows are simply visible.

The logo art is generated: `python3 scripts/ascii-logo.py 24` writes `src/components/sections/Home/ascii-logo.ts` from `compsoc_logo.png`. The hero draws it as SVG pixels on a 0.6em × 1em cell grid (block glyphs leave seams).

Motion is **never imported statically**. Use `loadMotion()` from `src/lib/motion.ts`,
which dynamically imports `src/lib/motion-exports.ts`. Export only what you use
from that file: a bare `import("motion")` can't be tree-shaken and grows the
chunk from ~21 KB to ~47 KB gzipped. Home page cost today: under 1 KB eager, and
a ~21 KB chunk the hero starts fetching on mount.

Everything built on motion is an enhancement over a correct static state:
- `CountUp` (`src/components/ui/count-up.tsx`) prerenders the final number. It resets to 0 only after motion has loaded, and only while off screen.
- `useLogoFlight()` (run by the hero) is a scroll-scrubbed shared-element transition: the hero logo lifts out and arcs into the bar's empty icon slot (sideways and shrinking early, then straight up, so it never crosses the wordmark) beside the always-visible wordmark, its opacity animating from the hero's (0.7 when the hero window is inactive) to full, and swapping for the bar icon as it lands (no fades). Before motion loads (and under reduced motion) the CSS rule `.nav-logo[data-hero-top] img` hides the bar icon at the hero and shows it once the hero isn't active.
- `useMagnetic()` pulls the hero buttons toward the pointer on a spring. It's mouse/trackpad only and kept small so the buttons never overlap.
- The wallpaper's pointer parallax only attaches on `(hover: hover) and (pointer: fine)`.

Measured options (home page, gzip) for reference:

| Approach | Eager | Lazy |
|---|---|---|
| `motion.div` from `motion/react` | +39.6 KB | – |
| `LazyMotion` + `domAnimation` (sync) | +26.6 KB | – |
| `LazyMotion` + async `domAnimation` | +14.5 KB | 14.5 KB |
| `LazyMotion` + async `domMax` | +14.4 KB | 27.9 KB |
| `React.lazy` island using `motion/react` | +0.2 KB | 39.4 KB |
| `import("motion")` → `animate` + `scroll` (used) | +0.1 KB | 21.3 KB |
| `import("motion/mini")` → `animate` (WAAPI only, no springs/JS values) | +0.1 KB | ~3.7 KB |

For layout/presence animations (`layoutId`, `AnimatePresence`) on a single
route, use a `React.lazy` island on that route rather than `LazyMotion` at the root.
