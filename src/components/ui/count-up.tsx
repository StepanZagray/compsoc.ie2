import { useEffect, useRef } from "react"
import { prefersReducedMotion } from "#/lib/motion"

const format = new Intl.NumberFormat("en-IE")

const DURATION_MS = 1400
/** Matches --enter in styles.css: the window pops in first. */
const DELAY_MS = 360
const easeOut = (t: number) => 1 - (1 - t) ** 4

/**
 * A number that counts up from zero the first time it scrolls into view.
 *
 * Prerendered with its final value, so it reads right without JS. After
 * hydration, a number that starts off screen is reset to 0 and, once it's 60%
 * visible and the window it sits in has popped in, counted up over 1.4s with
 * requestAnimationFrame; one already on screen keeps its final value. Under
 * reduced motion nothing moves. Screen readers always get the final value.
 */
export function CountUp({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const el = ref.current
		if (
			!el ||
			prefersReducedMotion() ||
			el.getBoundingClientRect().top < window.innerHeight
		) {
			return
		}
		el.textContent = format.format(0)

		let frame = 0
		let timer: ReturnType<typeof setTimeout> | undefined
		const run = () => {
			const start = performance.now()
			const tick = (now: number) => {
				const t = Math.min(1, (now - start) / DURATION_MS)
				el.textContent = format.format(
					Math.round(value * easeOut(t)),
				)
				if (t < 1) frame = requestAnimationFrame(tick)
			}
			frame = requestAnimationFrame(tick)
		}

		const observer = new IntersectionObserver(
			(entries) => {
				if (
					!entries.some(
						(entry) => entry.intersectionRatio >= 0.6,
					)
				) {
					return
				}
				observer.disconnect()
				timer = setTimeout(run, DELAY_MS)
			},
			{ threshold: [0, 0.6] },
		)
		observer.observe(el)

		return () => {
			observer.disconnect()
			clearTimeout(timer)
			cancelAnimationFrame(frame)
			el.textContent = format.format(value)
		}
	}, [value])

	return (
		<>
			<span className="sr-only">
				{format.format(value)}
			</span>
			<span
				ref={ref}
				aria-hidden
				className="inline-block tabular-nums"
				// Reserve the final width so neighbours don't shift as digits grow.
				style={{
					minWidth: `${format.format(value).length}ch`,
				}}
			>
				{format.format(value)}
			</span>
		</>
	)
}
