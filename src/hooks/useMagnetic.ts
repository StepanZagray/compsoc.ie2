import { type RefObject, useEffect } from "react"
import {
	loadMotion,
	prefersReducedMotion,
} from "#/lib/motion"

/**
 * Pulls an element toward the pointer on a spring while hovered, and lets it
 * spring home on leave. Mouse and trackpad only.
 *
 * `strength` is the share of the pointer's offset from the element's centre
 * that it follows.
 */
export function useMagnetic(
	ref: RefObject<HTMLElement | null>,
	strength = 0.25,
) {
	useEffect(() => {
		const el = ref.current
		if (
			!el ||
			prefersReducedMotion() ||
			!window.matchMedia(
				"(hover: hover) and (pointer: fine)",
			).matches
		) {
			return
		}

		const controller = new AbortController()
		let current: { stop: () => void } | undefined
		loadMotion()
			.then(({ animate }) => {
				if (controller.signal.aborted) return
				const spring = {
					type: "spring",
					stiffness: 260,
					damping: 16,
					mass: 0.5,
				} as const
				const move = (x: number, y: number) => {
					current = animate(el, { x, y }, spring)
				}
				el.addEventListener(
					"pointermove",
					(event) => {
						const rect = el.getBoundingClientRect()
						move(
							(event.clientX -
								(rect.left + rect.width / 2)) *
								strength,
							(event.clientY -
								(rect.top + rect.height / 2)) *
								strength,
						)
					},
					{ signal: controller.signal },
				)
				el.addEventListener(
					"pointerleave",
					() => move(0, 0),
					{
						signal: controller.signal,
					},
				)
			})
			.catch(() => {
				// Motion failed to load: the element stays put.
			})

		return () => {
			controller.abort()
			current?.stop()
			el.style.removeProperty("transform")
		}
	}, [ref, strength])
}
