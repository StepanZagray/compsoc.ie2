import { useEffect, useRef } from "react"
import {
	loadMotion,
	prefersReducedMotion,
} from "#/lib/motion"

const format = new Intl.NumberFormat("en-IE")

/**
 * A number that counts up from zero the first time it scrolls into view.
 *
 * The prerendered HTML carries the final value, and that is what shows until
 * motion has loaded. Only then, and only if the number is still off screen,
 * is it reset to 0, so the reset is never visible and a failed load leaves the
 * real value in place. Numbers already on screen at that point stay as they are.
 */
export function CountUp({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		el.textContent = format.format(value)
		if (prefersReducedMotion()) return

		let cancelled = false
		let stopAnimation: (() => void) | undefined
		let observer: IntersectionObserver | undefined

		loadMotion()
			.then(({ animate }) => {
				if (cancelled) return
				let first = true
				observer = new IntersectionObserver(
					(entries) => {
						// Several entries can queue up while scrolling; the last is current.
						const entry = entries[entries.length - 1]
						// The first callback reports the current state.
						if (first) {
							first = false
							if (entry.isIntersecting) {
								observer?.disconnect()
								return
							}
							el.textContent = "0"
						}
						if (entry.intersectionRatio < 0.6) return
						observer?.disconnect()
						const controls = animate(0, value, {
							duration: 1.4,
							ease: [0.16, 1, 0.3, 1],
							onUpdate: (latest) => {
								el.textContent = format.format(
									Math.round(latest),
								)
							},
						})
						stopAnimation = () => controls.stop()
					},
					{ threshold: [0, 0.6] },
				)
				observer.observe(el)
			})
			.catch(() => {
				// The static value is already correct; nothing to undo.
			})

		return () => {
			cancelled = true
			observer?.disconnect()
			stopAnimation?.()
		}
	}, [value])

	return (
		<>
			{/* Screen readers and print get the real value, never the count. */}
			<span className="sr-only print:not-sr-only">
				{format.format(value)}
			</span>
			<span
				ref={ref}
				aria-hidden
				className="inline-block tabular-nums print:hidden"
				// Reserve the final width so the icon beside it doesn't shift as digits grow.
				style={{
					minWidth: `${format.format(value).length}ch`,
				}}
			>
				{format.format(value)}
			</span>
		</>
	)
}
