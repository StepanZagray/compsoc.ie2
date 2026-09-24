/**
 * Whether the app has finished hydrating the prerendered page.
 *
 * The root layout flips this in an effect. Effects run child-first, so any
 * component rendering during hydration still sees `false`, while everything
 * rendered later by client-side navigation sees `true`. The home page uses it
 * to play its intro only when home is the page that was loaded.
 */
let hydrated = false

export function isHydrated(): boolean {
	return hydrated
}

export function markHydrated(): void {
	hydrated = true
}
