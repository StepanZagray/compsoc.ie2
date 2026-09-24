import { useSyncExternalStore } from "react"

const subscribe = () => () => {}

/**
 * True while this component is rendering the prerendered HTML (on the server,
 * and on the client while hydrating it), false for any render after that,
 * such as a client-side navigation to the page.
 *
 * React uses a store's server snapshot for both the server render and
 * hydration, including hydration of lazily loaded routes, so this can't
 * disagree with the server HTML. It flips to false right after hydration:
 * latch it (e.g. with useState) if it should stay fixed for the component's
 * lifetime.
 */
export function useIsHydrating(): boolean {
	return useSyncExternalStore(
		subscribe,
		() => false,
		() => true,
	)
}
