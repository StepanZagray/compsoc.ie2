import { type RefObject, useEffect } from "react"
import {
	loadMotion,
	prefersReducedMotion,
} from "#/lib/motion"

/**
 * Hyprland-style popin for a window further down the page, tied to scroll:
 * the window grows from 80% (anchored at its top edge) and fades in while its
 * top edge crosses the bottom fifth of the viewport, so it is full size well
 * before it turns active around the middle. Reverses when scrolled back.
 * Driven by motion's scroll(), which runs on the compositor via ScrollTimeline
 * where supported.
 *
 * `finishAt` is where the window's top edge is when it reaches full size, as a
 * fraction of the viewport height. Only the footer changes it: at the bottom of
 * the page it can't rise to 0.8.
 *
 * Until motion has loaded (during the hero's intro, while scrolling is locked)
 * the window is simply shown as is, so nothing depends on JS to be visible.
 */
export function useScrollWindow(
	ref: RefObject<HTMLElement | null>,
	finishAt = 0.8,
) {
	useEffect(() => {
		const el = ref.current
		if (!el || prefersReducedMotion()) return

		let stop: (() => void) | undefined
		let cancelled = false
		loadMotion()
			.then(({ animate, scroll }) => {
				if (cancelled) return
				el.style.transformOrigin = "50% 0"
				stop = scroll(
					animate(
						el,
						{ opacity: [0, 1], scale: [0.8, 1] },
						{ ease: [0.2, 0.8, 0.2, 1] },
					),
					{
						target: el,
						offset: ["start end", `start ${finishAt}`],
					},
				)
			})
			.catch(() => {
				// Motion failed to load: the window just stays put.
			})

		return () => {
			cancelled = true
			stop?.()
			el.style.removeProperty("transform-origin")
			el.style.removeProperty("opacity")
			el.style.removeProperty("transform")
		}
	}, [ref, finishAt])
}
