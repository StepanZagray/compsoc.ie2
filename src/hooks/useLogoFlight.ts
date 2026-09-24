import { type RefObject, useEffect } from "react"
import {
	loadMotion,
	prefersReducedMotion,
} from "#/lib/motion"

/** Where the hexagon sits inside compsoc_logo.png (the bar's icon), as fractions. */
const ICON_HEX = { left: 0.0675, right: 0.9325 }

const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeIn = (t: number) => t ** 3
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) =>
	a + (b - a) * t

/**
 * Shared-element transition between the home hero's logo and the bar's: as
 * the page scrolls from the top, the hero logo lifts out of the terminal and
 * arcs up into the bar's logo slot beside the wordmark (which stays put),
 * swapping for the bar icon as it lands. Scrolling back reverses it.
 * It is scrubbed by scroll position (motion's scroll()), so it can't drift
 * out of sync or stop halfway.
 *
 * Motion loads lazily, so this starts as plain CSS: `.nav-logo[data-hero-top]`
 * hides the bar icon at the hero in the prerendered page and shows it once
 * the hero isn't the active section. When motion is here (normally during the
 * intro, while scrolling is locked) the link gets `data-motion`, which turns
 * that rule off, and this hook drives the styles instead. Reduced motion keeps
 * the CSS swap.
 */
export function useLogoFlight(
	heroLogoRef: RefObject<SVGSVGElement | null>,
) {
	useEffect(() => {
		// The hero owns the flight: it mounts together with its logo, while the
		// bar (and its logo) is always on the page.
		const heroLogo = heroLogoRef.current
		const navLogo =
			document.querySelector<HTMLElement>(".nav-logo")
		const icon = navLogo?.querySelector("img")
		if (
			!navLogo ||
			!heroLogo ||
			!icon ||
			prefersReducedMotion()
		) {
			return
		}

		let stop: (() => void) | undefined
		let flyer: SVGSVGElement | undefined
		let cancelled = false

		loadMotion()
			.then(({ scroll }) => {
				if (cancelled) return

				// The traveller: a fixed copy of the hero logo, so neither the hero's
				// clipping nor its transforms apply. It lives inside the bar, first
				// in order: it draws over the bar but under the mobile menu overlay.
				flyer = heroLogo.cloneNode(true) as SVGSVGElement
				Object.assign(flyer.style, {
					position: "fixed",
					left: "0",
					top: "0",
					pointerEvents: "none",
					transformOrigin: "0 0",
					visibility: "hidden",
				})
				;(navLogo.parentElement ?? document.body).prepend(
					flyer,
				)
				const traveller = flyer

				// The hero window dims its content, logo included, as a whole.
				const heroContent =
					heroLogo.closest<HTMLElement>(
						"[style*='opacity']",
					) ?? heroLogo
				const heroOpacity = () =>
					Number(getComputedStyle(heroContent).opacity)

				const render = () => {
					const from = heroLogo.getBoundingClientRect()
					const slot = icon.getBoundingClientRect()
					const to = {
						left: slot.left + slot.width * ICON_HEX.left,
						top: slot.top,
						width:
							slot.width * (ICON_HEX.right - ICON_HEX.left),
						height: slot.height,
					}
					// Progress: 0 with the page at the top, 1 once the hero logo
					// would have scrolled up to the bar.
					const distance =
						from.top + window.scrollY - to.top || 1
					const progress = clamp01(
						window.scrollY / distance,
					)
					// An arc, not a straight line: it slides sideways and shrinks
					// early (ease-out) while it's still down in the page, then rises
					// (ease-in) straight into the slot, so it never crosses the
					// wordmark beside the slot.
					const across = easeOut(progress)
					const up = easeIn(progress)

					const flying = progress > 0 && progress < 1
					heroLogo.style.visibility =
						progress > 0 ? "hidden" : ""
					traveller.style.visibility = flying
						? "visible"
						: "hidden"
					if (flying) {
						const x = lerp(from.left, to.left, across)
						const y = lerp(from.top, to.top, up)
						const sx = lerp(
							1,
							to.width / from.width,
							across,
						)
						const sy = lerp(
							1,
							to.height / from.height,
							across,
						)
						traveller.style.transform = `translate(${x}px, ${y}px) scale(${sx}, ${sy})`
						// Opacity travels too: from however the hero shows the logo
						// (its content dims when the hero isn't the active window)
						// to fully opaque in the bar.
						traveller.style.opacity = String(
							lerp(heroOpacity(), 1, across),
						)
					}

					// The pixel art swaps for the bar icon in the frame it lands,
					// exactly on top of it and fully opaque. The wordmark beside
					// the slot never moves or hides.
					navLogo.dataset.motion = ""
					icon.style.visibility =
						progress >= 1 ? "visible" : "hidden"
				}

				render()
				stop = scroll(render)
			})
			.catch(() => {
				// Motion failed to load: the CSS fade still hands the logo over.
			})

		return () => {
			cancelled = true
			stop?.()
			flyer?.remove()
			heroLogo.style.removeProperty("visibility")
			delete navLogo.dataset.motion
			icon.style.removeProperty("visibility")
		}
	}, [heroLogoRef])
}
