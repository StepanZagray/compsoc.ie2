import { type RefObject, useEffect } from "react"
import { prefersReducedMotion } from "#/lib/motion"

/**
 * Pops a window in the first time it scrolls into view, once, the way a
 * Hyprland window opens (`.scroll-window[data-enter]` in styles.css). Only
 * windows still below the fold after hydration are armed, so nothing already
 * on screen, in the prerendered page or under reduced motion, is ever hidden.
 * Runs once the window is `threshold` visible (or that much of the screen,
 * for a window taller than the viewport).
 */
export function useWindowEnter(
	ref: RefObject<HTMLElement | null>,
	threshold = 0.15,
) {
	useEffect(() => {
		const el = ref.current
		if (
			!el ||
			prefersReducedMotion() ||
			el.getBoundingClientRect().top < window.innerHeight
		) {
			return
		}
		el.dataset.enter = "armed"
		const observer = new IntersectionObserver(
			(entries) => {
				const seen = entries.some(
					(entry) =>
						entry.intersectionRatio >= threshold ||
						entry.intersectionRect.height >=
							window.innerHeight * threshold,
				)
				if (!seen) return
				observer.disconnect()
				el.dataset.enter = "run"
			},
			{ threshold: [0, threshold] },
		)
		observer.observe(el)
		return () => {
			observer.disconnect()
			delete el.dataset.enter
		}
	}, [ref, threshold])
}
