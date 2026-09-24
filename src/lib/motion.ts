/**
 * Lazy access to the `motion` animation library.
 *
 * Only used where CSS genuinely can't do the job: springs that follow the
 * pointer and keep their momentum when retargeted (the hero wallpaper's
 * parallax and the magnetic buttons). Everything else animates in CSS.
 *
 * Nothing in the eager bundle imports motion: every caller goes through
 * loadMotion(), which Vite splits into its own chunk. The hero starts the
 * download on mount, while the CSS-only intro in styles.css plays.
 * Everything built on it is an enhancement: until (or unless) it loads, the
 * page shows its final, static state.
 */
type MotionModule = typeof import("./motion-exports")

let pending: Promise<MotionModule> | null = null

export function loadMotion(): Promise<MotionModule> {
	pending ??= import("./motion-exports").catch((error) => {
		// Allow a later caller to retry, e.g. after a flaky network.
		pending = null
		throw error
	})
	return pending
}

export function prefersReducedMotion(): boolean {
	return window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches
}
