import {
	createContext,
	type ReactNode,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"

export type SectionId =
	| "hero"
	| "about-who"
	| "about-mission"
	| "about-constitution"
	| "stats"
	| "footer"
	| "menu"

const TAP_ACTIVE_MS = 500

type ActiveSectionContextValue = {
	activeSectionId: SectionId | null
	registerSection: (
		id: SectionId,
		ref: RefObject<HTMLElement | null>,
	) => () => void
	setFooterHovered: (hovered: boolean) => void
	setMenuHovered: (hovered: boolean) => void
	/** On mobile tap: make this section active for 0.5s, then revert to view-based. */
	setTapOverride: (id: SectionId) => void
}

const ActiveSectionContext =
	createContext<ActiveSectionContextValue | null>(null)

/** How many pixels of scrolling are left before the bottom of the page. */
function pageScrollRemaining(): number {
	const root = document.documentElement
	return (
		root.scrollHeight - window.innerHeight - window.scrollY
	)
}

/**
 * The line, in viewport pixels from the top, that decides what has focus:
 * whatever is under it (or nearest to it) is active. It sits at the middle of
 * the viewport, but over the last half-screen of scrolling it slides down to
 * the bottom edge, so short things near the end of the page, which never
 * reach the middle, still get their turn.
 */
function focusLine(): number {
	return Math.max(
		window.innerHeight / 2,
		window.innerHeight - pageScrollRemaining(),
	)
}

export function useActiveSection() {
	const ctx = useContext(ActiveSectionContext)
	if (!ctx) {
		throw new Error(
			"useActiveSection must be used within ActiveSectionProvider",
		)
	}
	return ctx
}

/**
 * `scrollFocus`: whether the scroll position decides the active section. On
 * for the home page, whose sections are one continuous desktop you move
 * through; everywhere else only the cursor (hover) or a tap activates.
 */
export function ActiveSectionProvider({
	children,
	scrollFocus,
}: {
	children: ReactNode
	scrollFocus: boolean
}) {
	const [activeSectionId, setActiveSectionId] =
		useState<SectionId | null>(null)
	const [footerHovered, setFooterHovered] = useState(false)
	const [menuHovered, setMenuHovered] = useState(false)
	// Registered sections, and the one the scroll position makes active.
	const sectionsRef = useRef(
		new Map<SectionId, RefObject<HTMLElement | null>>(),
	)
	const [registeredIds, setRegisteredIds] = useState<
		Set<SectionId>
	>(new Set())
	const [scrollActiveId, setScrollActiveId] =
		useState<SectionId | null>(null)
	const [tapOverrideId, setTapOverrideId] =
		useState<SectionId | null>(null)
	const tapOverrideTimeoutRef = useRef<ReturnType<
		typeof setTimeout
	> | null>(null)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		const mql = window.matchMedia("(max-width: 767px)")
		const handler = () => setIsMobile(mql.matches)
		handler()
		mql.addEventListener("change", handler)
		return () => mql.removeEventListener("change", handler)
	}, [])

	const setTapOverride = useCallback((id: SectionId) => {
		if (tapOverrideTimeoutRef.current) {
			clearTimeout(tapOverrideTimeoutRef.current)
			tapOverrideTimeoutRef.current = null
		}
		setTapOverrideId(id)
		tapOverrideTimeoutRef.current = setTimeout(() => {
			setTapOverrideId(null)
			tapOverrideTimeoutRef.current = null
			// Clear hover so menu/footer don't stay active after tap (synthetic pointer events on touch)
			setMenuHovered(false)
			setFooterHovered(false)
		}, TAP_ACTIVE_MS)
	}, [])

	useEffect(
		() => () => {
			if (tapOverrideTimeoutRef.current) {
				clearTimeout(tapOverrideTimeoutRef.current)
			}
		},
		[],
	)

	const registerSection = useCallback(
		(id: SectionId, ref: RefObject<HTMLElement | null>) => {
			sectionsRef.current.set(id, ref)
			setRegisteredIds((prev) => new Set(prev).add(id))
			return () => {
				sectionsRef.current.delete(id)
				setRegisteredIds((prev) => {
					const next = new Set(prev)
					next.delete(id)
					return next
				})
			}
		},
		[],
	)

	// Scroll-based focus: the section under the focus line (or the nearest one,
	// if the line falls in a gap) is active. At the very bottom
	// of the page the footer is, since it can never reach the middle.
	// biome-ignore lint/correctness/useExhaustiveDependencies: registeredIds re-runs the measure when sections mount
	useEffect(() => {
		let frame = 0
		const measure = () => {
			frame = 0
			if (
				pageScrollRemaining() <= 2 &&
				sectionsRef.current.has("footer")
			) {
				setScrollActiveId("footer")
				return
			}
			const middle = focusLine()
			let best: SectionId | null = null
			let bestDistance = Number.POSITIVE_INFINITY
			for (const [id, ref] of sectionsRef.current) {
				if (id === "footer" || id === "menu") continue
				const rect = ref.current?.getBoundingClientRect()
				if (!rect || rect.height === 0) continue
				const distance =
					middle < rect.top
						? rect.top - middle
						: middle > rect.bottom
							? middle - rect.bottom
							: 0
				if (distance < bestDistance) {
					bestDistance = distance
					best = id
				}
			}
			setScrollActiveId(best)
		}
		const schedule = () => {
			frame ||= requestAnimationFrame(measure)
		}
		measure()
		window.addEventListener("scroll", schedule, {
			passive: true,
		})
		window.addEventListener("resize", schedule)
		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", schedule)
			window.removeEventListener("resize", schedule)
		}
	}, [registeredIds])

	useEffect(() => {
		// On mobile: scroll only; on desktop: tap override and hover can set active
		if (!isMobile && tapOverrideId !== null) {
			setActiveSectionId(tapOverrideId)
			return
		}
		if (!isMobile && menuHovered) {
			setActiveSectionId("menu")
			return
		}
		if (!isMobile && footerHovered) {
			setActiveSectionId("footer")
			return
		}
		setActiveSectionId(scrollFocus ? scrollActiveId : null)
	}, [
		scrollFocus,
		isMobile,
		tapOverrideId,
		menuHovered,
		footerHovered,
		scrollActiveId,
	])

	const value = useMemo<ActiveSectionContextValue>(
		() => ({
			activeSectionId,
			registerSection,
			setFooterHovered,
			setMenuHovered,
			setTapOverride,
		}),
		[activeSectionId, registerSection, setTapOverride],
	)

	return (
		<ActiveSectionContext.Provider value={value}>
			{children}
		</ActiveSectionContext.Provider>
	)
}
