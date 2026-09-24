/**
 * Lazy access to the `motion` animation library.
 *
 * Nothing in the eager bundle imports motion: every caller goes through
 * loadMotion(), which Vite splits into its own chunk. The hero
 * starts the download on mount, while the CSS-only intro in styles.css plays, so
 * by the time the intro ends the library is usually already there.
 *
 * Everything built on it is an enhancement: until (or unless) it loads, the page
 * shows its final, static state.
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
