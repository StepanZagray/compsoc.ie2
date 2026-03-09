import {
	createContext,
	type ReactNode,
	type RefObject,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"

export type SectionId = "hero" | "about" | "footer" | "menu"

type ActiveSectionContextValue = {
	activeSectionId: SectionId | null
	registerSection: (
		id: SectionId,
		ref: RefObject<HTMLElement | null>,
	) => () => void
	setFooterHovered: (hovered: boolean) => void
	setMenuHovered: (hovered: boolean) => void
}

const ActiveSectionContext =
	createContext<ActiveSectionContextValue | null>(null)

export function useActiveSection() {
	const ctx = useContext(ActiveSectionContext)
	if (!ctx) {
		throw new Error(
			"useActiveSection must be used within ActiveSectionProvider",
		)
	}
	return ctx
}

export function ActiveSectionProvider({
	children,
}: {
	children: ReactNode
}) {
	const [activeSectionId, setActiveSectionId] =
		useState<SectionId | null>(null)
	const [footerHovered, setFooterHovered] = useState(false)
	const [menuHovered, setMenuHovered] = useState(false)
	const [ratios, setRatios] = useState<
		Record<SectionId, number>
	>({
		hero: 0,
		about: 0,
		footer: 0,
		menu: 0,
	})
	const [registeredIds, setRegisteredIds] = useState<
		Set<SectionId>
	>(new Set())

	const registerSection = useCallback(
		(id: SectionId, ref: RefObject<HTMLElement | null>) => {
			setRegisteredIds((prev) => new Set(prev).add(id))
			const el = ref.current
			if (!el) {
				return () => {
					setRegisteredIds((prev) => {
						const next = new Set(prev)
						next.delete(id)
						return next
					})
				}
			}
			const observer = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						const ratio = entry.intersectionRatio
						setRatios((prev) => ({ ...prev, [id]: ratio }))
					}
				},
				{
					threshold: [
						0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9,
						1,
					],
				},
			)
			observer.observe(el)
			return () => {
				observer.disconnect()
				setRegisteredIds((prev) => {
					const next = new Set(prev)
					next.delete(id)
					return next
				})
			}
		},
		[],
	)

	useEffect(() => {
		if (menuHovered) {
			setActiveSectionId("menu")
			return
		}
		if (footerHovered) {
			setActiveSectionId("footer")
			return
		}
		// Only hero and about compete by scroll; footer is active only on hover
		const scrollSectionIds = ["hero", "about"] as const
		const entries = Array.from(registeredIds)
			.filter(
				(id): id is (typeof scrollSectionIds)[number] =>
					scrollSectionIds.includes(
						id as (typeof scrollSectionIds)[number],
					),
			)
			.map((id) => {
				const raw = ratios[id] ?? 0
				// Hero must be ≥70% visible to stay active;
				const effective =
					id === "hero" && raw < 0.75 ? 0 : raw
				return [id, effective] as [SectionId, number]
			})
		if (entries.length === 0) {
			setActiveSectionId(null)
			return
		}
		const best = entries.reduce((a, b) =>
			a[1] >= b[1] ? a : b,
		)
		setActiveSectionId(best[1] > 0 ? best[0] : null)
	}, [menuHovered, footerHovered, ratios, registeredIds])

	const value = useMemo<ActiveSectionContextValue>(
		() => ({
			activeSectionId,
			registerSection,
			setFooterHovered,
			setMenuHovered,
		}),
		[activeSectionId, registerSection],
	)

	return (
		<ActiveSectionContext.Provider value={value}>
			{children}
		</ActiveSectionContext.Provider>
	)
}
