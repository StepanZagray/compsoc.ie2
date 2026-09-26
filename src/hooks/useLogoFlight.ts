import { type RefObject, useEffect } from "react"
import { prefersReducedMotion } from "#/lib/motion"

/** Where the hexagon sits inside compsoc_logo.png (the bar's icon), as fractions. */
const ICON_HEX = { left: 0.0675, right: 0.9325 }

const easeOut = (t: number) => 1 - (1 - t) ** 3
const easeIn = (t: number) => t ** 3
const clamp01 = (t: number) => Math.min(1, Math.max(0, t))
const lerp = (a: number, b: number, t: number) =>
	a + (b - a) * t

/**
 * Shared-element transition between the home hero's pixel logo and the bar's
 * logo lockup: as the page scrolls from the top, the logo lifts out of the
 * terminal and flies into the bar's icon slot, swapping for the bar icon as
 * it lands and clearing the shade off the wordmark as it slides over it.
 * Scrolling back reverses it. Scrubbed by scroll position, so it can't drift out of sync or
 * stop halfway. No animation library: geometry, recomputed once per frame
 * while scrolling.
 *
 * The path keeps the logo off every line of text: it rises (and shrinks)
 * first, straight up through the empty space above it, and only slides
 * sideways once it's up in the bar, where only the (dimmed) wordmark is. It rises
 * faster than the page scrolls, so what starts below it never catches up.
 *
 * Before hydration it's plain CSS: `.nav-logo[data-hero-top]` hides the bar's
 * icon and dims its wordmark at the hero in the prerendered page, and undoes
 * both once the hero isn't the active section. Once this runs, the link gets
 * `data-flight`, which turns that rule off, and this hook drives the styles
 * instead. Reduced motion keeps the CSS swap.
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
		const wordmark =
			navLogo?.querySelector<HTMLElement>(".nav-wordmark")
		const shade = navLogo?.querySelector<HTMLElement>(
			".nav-wordmark-shade",
		)
		if (
			!navLogo ||
			!heroLogo ||
			!icon ||
			!wordmark ||
			!shade ||
			prefersReducedMotion()
		) {
			return
		}

		// The traveller: a fixed copy of the hero logo, so neither the hero's
		// clipping nor its transforms apply. It lives inside the bar and
		// draws over the bar and the wordmark (z-index 20) but under the
		// mobile menu overlay (z-30). The copy keeps the hero's font size,
		// since the logo is sized in em.
		const traveller = heroLogo.cloneNode(
			true,
		) as SVGSVGElement
		// Scrolling during the intro: the copy is whole at once, not
		// re-printed row by row from when it was made.
		for (const row of traveller.querySelectorAll(
			".intro-print",
		)) {
			row.classList.remove("intro-print")
		}
		Object.assign(traveller.style, {
			position: "fixed",
			left: "0",
			top: "0",
			margin: "0",
			pointerEvents: "none",
			// Above the wordmark and its shade, which it passes over.
			zIndex: "20",
			transformOrigin: "0 0",
			visibility: "hidden",
			fontSize: getComputedStyle(heroLogo).fontSize,
		})
		;(navLogo.parentElement ?? document.body).prepend(
			traveller,
		)

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
			const progress = clamp01(window.scrollY / distance)
			// Up (and smaller) early, ease-out; across late, ease-in.
			const up = easeOut(progress)
			const across = easeIn(progress)

			const x = lerp(from.left, to.left, across)
			const y = lerp(from.top, to.top, up)
			const sx = lerp(1, to.width / from.width, up)
			const sy = lerp(1, to.height / from.height, up)

			const flying = progress > 0 && progress < 1
			heroLogo.style.visibility =
				progress > 0 ? "hidden" : ""
			traveller.style.visibility = flying
				? "visible"
				: "hidden"
			if (flying) {
				traveller.style.transform = `translate(${x}px, ${y}px) scale(${sx}, ${sy})`
			}

			// The pixel logo swaps for the bar icon in the frame it lands,
			// exactly on top of it and fully opaque.
			navLogo.dataset.flight = ""
			icon.style.visibility =
				progress >= 1 ? "visible" : "hidden"

			// The wordmark sits dimmed under a shade until the logo passes
			// over it: the shade ends at the logo's centre line, so text the
			// logo has crossed is at full brightness, text still ahead of it
			// stays dim, and the join is always hidden behind the logo.
			const mark = wordmark.getBoundingClientRect()
			const centre =
				progress >= 1
					? mark.left
					: x + (from.width * sx) / 2
			const dimmed = Math.min(
				mark.width,
				Math.max(0, centre - mark.left),
			)
			shade.style.opacity = "1"
			shade.style.width = `${dimmed}px`
		}

		render()
		let frame = 0
		const schedule = () => {
			frame ||= requestAnimationFrame(() => {
				frame = 0
				render()
			})
		}
		window.addEventListener("scroll", schedule, {
			passive: true,
		})
		// The hero logo's size is responsive; keep the copy's text in step.
		const onResize = () => {
			traveller.style.fontSize =
				getComputedStyle(heroLogo).fontSize
			schedule()
		}
		window.addEventListener("resize", onResize)

		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", schedule)
			window.removeEventListener("resize", onResize)
			traveller.remove()
			heroLogo.style.removeProperty("visibility")
			delete navLogo.dataset.flight
			icon.style.removeProperty("visibility")
			shade.style.removeProperty("opacity")
			shade.style.removeProperty("width")
		}
	}, [heroLogoRef])
}
