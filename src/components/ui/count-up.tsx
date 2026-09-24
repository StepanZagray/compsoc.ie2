import {
	type CSSProperties,
	useEffect,
	useRef,
} from "react"
import { prefersReducedMotion } from "#/lib/motion"

const format = new Intl.NumberFormat("en-IE")

/**
 * A number that counts up from zero the first time it scrolls into view.
 *
 * The counting is CSS (.count-up in styles.css): a registered `--count`
 * integer animates from 0 to `--to` and is printed through a CSS counter.
 * This component only decides when: a number that starts off screen is armed
 * at 0 after hydration and runs once it's 60% visible; one already on screen
 * keeps its final value. Screen readers and print get the formatted value.
 */
export function CountUp({ value }: { value: number }) {
	const ref = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el || prefersReducedMotion()) return

		let first = true
		const observer = new IntersectionObserver(
			(entries) => {
				// Several entries can queue up while scrolling; the last is current.
				const entry = entries[entries.length - 1]
				// The first callback reports the current state.
				if (first) {
					first = false
					if (entry.isIntersecting) {
						observer.disconnect()
						return
					}
					el.dataset.count = "armed"
				}
				if (entry.intersectionRatio < 0.6) return
				observer.disconnect()
				el.dataset.count = "run"
			},
			{ threshold: [0, 0.6] },
		)
		observer.observe(el)

		return () => {
			observer.disconnect()
			delete el.dataset.count
		}
	}, [])

	return (
		<>
			<span className="sr-only print:not-sr-only">
				{format.format(value)}
			</span>
			<span
				ref={ref}
				aria-hidden
				className="count-up inline-block tabular-nums print:hidden"
				// Reserve the final width so neighbours don't shift as digits grow.
				style={
					{
						"--to": value,
						minWidth: `${String(value).length}ch`,
					} as CSSProperties
				}
			/>
		</>
	)
}
