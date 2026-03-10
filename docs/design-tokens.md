# Design Tokens & Animation

This doc is for developers and agents: where shared colors and motion values live, and how to keep them in sync so animations don’t flicker.

## Animation / transition timing

**Standard duration: 300 ms**

All UI transitions and animations use **300 ms** for consistency. Use this everywhere:

- **Tailwind:** `duration-300` (e.g. `transition-all duration-300`)
- **Motion (JS):** `duration: 0.3` in `transition` objects (e.g. in `sectionVariants`, `HamburgerIcon`, etc.)
- **Custom CSS:** `transition-duration: 300ms` or `0.3s`

When adding new animated elements (hover states, section borders, nav, cards, menus), keep the duration at 300 ms unless there is a strong reason to deviate, and document it here.

## Section motion (active/inactive)

**File:** `src/constants/section-variants.ts`

Used by Hero, About, and Footer for border color and opacity. The **border colors are numeric values** so Motion can interpolate; they must match the theme used in CSS.

- **Active:** `borderColor: "oklch(0.746 0.16 232.661)"`, `opacity: 1` (matches `.dark` `--border-accent`)
- **Inactive:** `borderColor: "oklch(0.278 0.033 256.848)"`, `opacity: 0.8` (matches `--border`)
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



