import { Link } from "@tanstack/react-router"
import {
	type CSSProperties,
	useEffect,
	useRef,
	useState,
} from "react"
import {
	CompSocLogo,
	HamburgerMenuIcon,
} from "#/components/icons"
import { sectionActiveBorderColor } from "#/constants/section-variants"
import { useActiveSection } from "#/contexts/active-section"
import { cn } from "#/lib/utils"
import { Button } from "./button"

const mainMenuItems = [
	{ text: "Home", link: "/" },
	{ text: "Events", link: "/events" },
	{ text: "Account", link: "/account" },
	{ text: "Committee", link: "/committee" },
	{ text: "Contact us", link: "/contact" },
]

function NavigationMenuComponent({
	isDesktop,
	currentPath,
}: {
	isDesktop: boolean
	currentPath: string
}) {
	const {
		activeSectionId,
		setMenuHovered,
		setTapOverride,
	} = useActiveSection()
	const menuActive = activeSectionId === "menu"

	// On the home page the logo lives in the hero and flies up into the bar as
	// the hero scrolls away (useLogoFlight, run by the hero). `heroTop` drives
	// the CSS state before hydration and under reduced motion (null: before the first scroll
	// measurement, when a home page load is always at the hero).
	const heroTop =
		currentPath === "/" &&
		(activeSectionId === "hero" || activeSectionId === null)

	const [isFullscreenMenuOpen, setisFullscreenMenuOpen] =
		useState(false)

	// Close mobile overlay when resizing to desktop
	useEffect(() => {
		if (isDesktop) setisFullscreenMenuOpen(false)
	}, [isDesktop])

	const toggleRef = useRef<HTMLButtonElement>(null)
	const menuRef = useRef<HTMLDivElement>(null)
	const open = isFullscreenMenuOpen

	// While open: Escape closes, Tab stays within the toggle and the menu
	// links, and the page behind doesn't scroll.
	useEffect(() => {
		if (!open) return
		const menu = menuRef.current
		const toggle = toggleRef.current
		if (!menu || !toggle) return

		const links = () =>
			Array.from(
				menu.querySelectorAll<HTMLElement>("a[href]"),
			)
		links()[0]?.focus()

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setisFullscreenMenuOpen(false)
				toggle.focus()
				return
			}
			if (event.key !== "Tab") return
			const order = [toggle, ...links()]
			const at = order.indexOf(
				document.activeElement as HTMLElement,
			)
			const next = event.shiftKey
				? (at - 1 + order.length) % order.length
				: (at + 1) % order.length
			event.preventDefault()
			order[at === -1 ? 0 : next].focus()
		}
		document.addEventListener("keydown", onKeyDown)
		const root = document.documentElement
		const overflow = root.style.overflow
		root.style.overflow = "hidden"
		return () => {
			document.removeEventListener("keydown", onKeyDown)
			root.style.overflow = overflow
		}
	}, [open])

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: hover only for active-section state
		<div
			className="intro-bar fixed top-0 left-0 z-1000 flex h-16 w-screen items-center justify-between border-border border-b-2 bg-background px-4 transition-[border-color] duration-300"
			onMouseEnter={() => setMenuHovered(true)}
			onMouseLeave={() => setMenuHovered(false)}
			onTouchEnd={() => setTapOverride("menu")}
			style={{
				borderBottomColor: menuActive
					? sectionActiveBorderColor
					: undefined,
			}}
		>
			<Link
				to="/"
				aria-label="Home"
				data-hero-top={heroTop || undefined}
				className="nav-logo flex h-full items-center rounded-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
			>
				<CompSocLogo />
			</Link>

			{/* Desktop Navigation Menu — visible from md up via CSS only (no flicker on load) */}
			<div className="hidden md:flex">
				<nav
					data-slot="navigation-menu"
					className="group/navigation-menu relative flex max-w-max flex-1 items-center justify-center"
				>
					<ul
						data-slot="navigation-menu-list"
						className="group flex flex-1 list-none items-center justify-center gap-0"
					>
						{mainMenuItems.map((item) => (
							<li
								key={item.link}
								data-slot="navigation-menu-item"
								className="relative flex items-stretch"
							>
								<Link
									to={item.link}
									data-slot="navigation-menu-link"
									data-active={
										currentPath === item.link
											? "true"
											: undefined
									}
									className={cn(
										"flex h-full w-30 items-center justify-center gap-1.5 p-2 text-muted-foreground text-sm outline-none transition-colors [&_svg:not([class*='size-'])]:size-4",
										"hover:text-foreground-light focus:text-foreground-light focus-visible:text-foreground-light data-[active=true]:text-foreground-light",
									)}
								>
									{item.text}
								</Link>
							</li>
						))}
					</ul>
				</nav>
			</div>
			{/* Mobile hamburger — visible below md via CSS only */}
			<div className="z-9999 aspect-square h-16 shrink-0 md:hidden">
				<Button
					ref={toggleRef}
					variant="transperent"
					aria-expanded={open}
					aria-controls="mobile-menu"
					onClick={() => setisFullscreenMenuOpen(!open)}
					className="relative flex h-full w-full shrink-0 items-center justify-center"
				>
					<HamburgerMenuIcon isOpen={open} />
				</Button>
			</div>
			{/* Mobile menu: fullscreen over the whole page, bar included (the close
			    button stays on top), laid out like a terminal prompt. Always mounted so it can
			    animate out as well as in; `inert` takes it out of focus and the
			    a11y tree while closed. md:hidden so it never shows on desktop. */}
			<div
				ref={menuRef}
				id="mobile-menu"
				data-open={open || undefined}
				inert={!open}
				className="mobile-menu absolute top-0 left-0 flex h-dvh w-screen bg-background md:hidden"
			>
				<nav
					data-slot="navigation-menu"
					aria-label="Main"
					className="flex w-full flex-col items-center justify-center"
				>
					<ul className="flex list-none flex-col gap-2">
						{mainMenuItems.map((item, i) => {
							const current = currentPath === item.link
							return (
								<li
									key={item.link}
									className="mobile-menu-item"
									style={{ "--i": i } as CSSProperties}
								>
									<Link
										to={item.link}
										onClick={() =>
											setisFullscreenMenuOpen(false)
										}
										aria-current={
											current ? "page" : undefined
										}
										className={cn(
											// As large as 2.25rem, but never wider than the screen: no wrapping.
											"relative flex items-center whitespace-nowrap rounded-sm py-1 font-bold text-[min(2.25rem,9vw)] leading-tight outline-none transition-colors",
											"focus-visible:ring-3 focus-visible:ring-ring/50",
											current
												? "text-foreground"
												: "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
										)}
									>
										<span
											className={cn(
												"absolute right-full mr-3 text-accent",
												!current && "invisible",
											)}
											aria-hidden
										>
											❯
										</span>
										{item.text}
									</Link>
								</li>
							)
						})}
					</ul>
				</nav>
			</div>
		</div>
	)
}

export { NavigationMenuComponent }
