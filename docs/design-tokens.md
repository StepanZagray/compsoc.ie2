# Design Tokens & Animation

This doc is for developers and agents: where shared colors and motion values live, and how to keep them in sync so animations don’t flicker.

## Section motion (active/inactive)

**File:** `src/constants/section-variants.ts`

Used by Hero, About, and Footer for border color and opacity. The **border colors are numeric values** so Motion can interpolate; they must match the theme used in CSS.

- **Active:** `borderColor: "oklch(0.828 0.111 230.318)"`, `opacity: 1`
- **Inactive:** `borderColor: "oklch(0.278 0.033 256.848)"`, `opacity: 0.8`
- **Transition:** `duration: 0.35`, `ease: [0.25, 0.1, 0.25, 1]`
- **Nav active border:** `sectionActiveBorderColor` is the same as the active border color (re-exported for the nav bar).

## CSS variables that must stay in sync

**File:** `src/styles.css`

Comments in `styles.css` mark variables that are mirrored in `section-variants.ts`:

- **Active border (section/nav):** `--border-sky` in both `:root` and `.dark` → same as `sectionVariants.active.borderColor`.
- **Inactive border:** `.dark` `--border` → same as `sectionVariants.inactive.borderColor`.

**Rule:** When changing active/inactive border colors, update both:

1. `src/constants/section-variants.ts` (active/inactive `borderColor`)
2. `src/styles.css` (`--border-sky` and, for inactive, `.dark` `--border`)

Otherwise the animated sections will jump or flicker because Motion interpolates between the constants while CSS uses different values.



