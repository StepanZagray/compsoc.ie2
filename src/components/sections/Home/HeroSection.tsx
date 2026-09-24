import {
	type CSSProperties,
	type ReactNode,
	type Ref,
	useEffect,
	useRef,
	useState,
} from "react"
import wallpaper from "#/assets/img/university/UoG.jpg?format=webp&w=640;1024;1440&quality=60&as=img"
import { DiscordIcon } from "#/components/icons/DiscordIcon"
import { InstagramIcon } from "#/components/icons/InstagramIcon"
import { sectionStyle } from "#/constants/section-variants"
import { useActiveSection } from "#/contexts/active-section"
import { useLogoFlight } from "#/hooks/useLogoFlight"
import { useMagnetic } from "#/hooks/useMagnetic"
import { useTypewriter } from "#/hooks/useTypewriter"
import { isHydrated } from "#/lib/first-load"
import {
	loadMotion,
	prefersReducedMotion,
} from "#/lib/motion"
import { cn } from "#/lib/utils"
import { ASCII_LOGO, ASCII_LOGO_COLS } from "./ascii-logo"

/** Output "prints" one terminal row at a time; see .intro-print in styles.css. */
const row = (n: number) => ({ "--row": n }) as CSSProperties

/** When a button's entry sweep starts, in output rows. */
const sweepAt = (n: number) =>
	({ "--sweep-row": n }) as CSSProperties

type SectionMotionProps = {
	activeVariant: { borderColor: string; opacity: number }
	inactiveVariant: { borderColor: string; opacity: number }
	transition: {
		duration: number
		ease: [number, number, number, number]
	}
}

const HeroSection = ({
	activeVariant,
	inactiveVariant,
	transition,
}: SectionMotionProps) => {
	const sectionRef = useRef<HTMLElement>(null)
	const {
		activeSectionId,
		registerSection,
		setTapOverride,
	} = useActiveSection()
	const active = activeSectionId === "hero"

	useEffect(
		() => registerSection("hero", sectionRef),
		[registerSection],
	)

	// The CSS intro only plays when home is the page that was loaded, never
	// after client-side navigation.
	const [intro] = useState(() => !isHydrated())

	// Start downloading motion now; the CSS intro covers the wait. Once it's
	// here, the wallpaper drifts toward the pointer on a spring (mouse/trackpad only).
	const photoRef = useRef<HTMLImageElement>(null)
	useEffect(() => {
		const section = sectionRef.current
		const photo = photoRef.current
		// Nothing on the page animates with motion under reduced motion.
		if (prefersReducedMotion()) return
		const motionReady = loadMotion()
		if (
			!section ||
			!photo ||
			!window.matchMedia(
				"(hover: hover) and (pointer: fine)",
			).matches
		) {
			return
		}

		// scale-105 leaves 2.5% of the height spare on each side; 12px stays
		// inside that down to a ~500px tall hero.
		const MAX_SHIFT_PX = 12
		const spring = {
			type: "spring",
			stiffness: 60,
			damping: 18,
			mass: 1,
		} as const
		const controller = new AbortController()

		motionReady
			.then(({ animate }) => {
				if (controller.signal.aborted) return
				let current: { stop: () => void } | undefined
				const drift = (x: number, y: number) => {
					current = animate(photo, { x, y }, spring)
				}
				controller.signal.addEventListener("abort", () =>
					current?.stop(),
				)
				section.addEventListener(
					"pointermove",
					(event) => {
						const rect = section.getBoundingClientRect()
						const dx =
							(event.clientX - rect.left) / rect.width - 0.5
						const dy =
							(event.clientY - rect.top) / rect.height - 0.5
						drift(
							-dx * 2 * MAX_SHIFT_PX,
							-dy * 2 * MAX_SHIFT_PX,
						)
					},
					{ signal: controller.signal },
				)
				section.addEventListener(
					"pointerleave",
					() => drift(0, 0),
					{
						signal: controller.signal,
					},
				)
			})
			.catch(() => {
				// Motion failed to load: the wallpaper just stays still.
			})

		return () => controller.abort()
	}, [])

	const word = useTypewriter(
		[
			"Computer",
			"Developer",
			"Technology",
			"AI",
			"Cybersecurity",
		],
		75,
		1600,
		active,
	)
	const logoRef = useRef<SVGSVGElement>(null)
	useLogoFlight(logoRef)

	const windowStyle = sectionStyle(
		active,
		activeVariant,
		inactiveVariant,
		transition,
	)
	// An unfocused window dims as a whole, text included (Hyprland's
	// inactive_opacity). The blur layer is left out: fading it would weaken the
	// blur itself rather than dim anything.
	const contentStyle: CSSProperties = {
		opacity: windowStyle.opacity,
		transition: windowStyle.transition,
	}

	return (
		<section
			ref={sectionRef}
			className={cn(
				"relative flex h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden",
				intro && "intro",
			)}
			onTouchEnd={() => setTapOverride("hero")}
		>
			{/* The desktop: wallpaper showing through the gaps and the blur. */}
			<div
				className="pointer-events-none absolute inset-0 overflow-hidden"
				style={{
					maskImage:
						"linear-gradient(to bottom, black 70%, transparent)",
				}}
				aria-hidden
			>
				<img
					ref={photoRef}
					src={wallpaper.src}
					srcSet={wallpaper.srcset}
					sizes="100vw"
					width={wallpaper.w}
					height={wallpaper.h}
					alt=""
					fetchPriority="high"
					decoding="async"
					className="h-full w-full scale-105 select-none object-cover opacity-50"
				/>
			</div>

			{/* Terminal window, tiled to fill the hero with 1rem gaps. */}
			<div className="intro-window absolute top-1/2 left-1/2 z-10 h-[calc(100%-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2">
				<div
					className="absolute inset-0 rounded-md backdrop-blur-sm"
					aria-hidden
				/>
				<div
					className="absolute inset-0 rounded-md bg-background/60 shadow-2xl"
					style={windowStyle}
					aria-hidden
				/>
				<div
					className="pointer-events-none absolute inset-0 z-20 rounded-md border-2"
					style={windowStyle}
					aria-hidden
				/>

				<p
					className="absolute top-4 left-4 z-10 text-sm md:top-5 md:left-5 md:text-base"
					style={contentStyle}
				>
					<span className="text-accent">~ ❯</span>{" "}
					<span className="intro-command inline-block overflow-hidden whitespace-nowrap align-bottom">
						compsoc
					</span>
					<Cursor className="intro-command-cursor" />
				</p>

				<div
					className="relative z-10 flex h-full items-center justify-center px-4 md:px-8"
					style={contentStyle}
				>
					{/* Phones: a centred stack, logo on top, printed top to bottom (the
					    info column's rows come after the logo's 17). From md: fastfetch's
					    logo beside left-aligned info. */}
					<div className="flex flex-col items-center gap-7 md:flex-row md:gap-10 lg:gap-14">
						<AsciiLogo
							ref={logoRef}
							className="shrink-0 text-[0.6875rem] md:text-[0.8125rem] lg:text-[0.9375rem]"
						/>

						<div className="min-w-0 text-sm max-md:text-center md:text-base max-md:[--row-offset:17]">
							<p
								className="intro-print text-accent max-md:hidden"
								style={row(0)}
							>
								compsoc
								<span className="text-foreground">@</span>
								galway
							</p>
							<p
								className="intro-print text-muted-foreground max-md:hidden"
								style={row(1)}
								aria-hidden
							>
								──────────────
							</p>
							{/* Never wraps: sizes are fluid where space is tight. On phones
							    "University of Galway's" steps down to an eyebrow and
							    "Computer Society" carries the weight, the rotating word on
							    its own line so its changing length can't reflow anything. */}
							<h1 className="whitespace-nowrap font-bold text-[min(2.75rem,10.5vw)]/[1.1] tracking-tight md:mt-3 md:text-[min(2.25rem,3.4vw)]/tight lg:text-5xl/tight">
								<span
									className="intro-print block max-md:mb-2 max-md:font-medium max-md:text-lg max-md:text-muted-foreground max-md:tracking-normal"
									style={row(2)}
								>
									University of Galway's
								</span>
								<span className="sr-only">
									Computer Society
								</span>
								<span
									className="intro-print block"
									style={row(4)}
									aria-hidden
								>
									<span className="text-accent max-md:block max-md:min-h-lh">
										{word}
									</span>{" "}
									<span className="max-md:block">
										Society
									</span>
								</span>
							</h1>

							<div className="mt-6 flex items-center gap-2 max-md:mt-8 max-md:justify-center">
								<JoinButton />
								<IconLink
									href="https://instagram.com/compsocgalway/"
									label="Instagram"
									sweepRow={9}
								>
									<InstagramIcon className="size-4" />
								</IconLink>
								<IconLink
									href="https://discord.compsoc.ie/"
									label="Discord"
									sweepRow={11}
								>
									<DiscordIcon className="size-4" />
								</IconLink>
							</div>
						</div>
					</div>
				</div>

				<p
					className="intro-print absolute bottom-4 left-4 z-10 text-sm md:bottom-5 md:left-5 md:text-base max-md:[--row-offset:12]"
					style={{ ...row(17), ...contentStyle }}
					aria-hidden
				>
					<span className="text-accent">~ ❯</span>{" "}
					<Cursor
						hollow={!active}
						// Only a focused terminal blinks its cursor.
						className={cn(active && "cursor-blink")}
					/>
				</p>
			</div>
		</section>
	)
}

type Pixel = "a" | "f" | "_"

/**
 * One row of half-block text as pixel runs: [colour, first column, width,
 * vertical offset within the row (0 for the top half, 0.5 for the bottom)].
 */
function rowPixels(
	runs: ReadonlyArray<readonly [string, string, string]>,
) {
	const top: Pixel[] = []
	const bottom: Pixel[] = []
	for (const [text, fg, bg] of runs) {
		for (const char of text) {
			const [t, b] =
				char === "█"
					? [fg, fg]
					: char === "▀"
						? [fg, bg]
						: char === "▄"
							? [bg, fg]
							: ["_", "_"]
			top.push(t as Pixel)
			bottom.push(b as Pixel)
		}
	}
	const spans = (line: Pixel[]) => {
		const out: Array<[Pixel, number, number]> = []
		line.forEach((pixel, x) => {
			const last = out[out.length - 1]
			if (
				last &&
				last[0] === pixel &&
				last[1] + last[2] === x
			) {
				last[2]++
			} else if (pixel !== "_") {
				out.push([pixel, x, 1])
			}
		})
		return out
	}
	return [
		...spans(top).map((span) => [...span, 0] as const),
		...spans(bottom).map((span) => [...span, 0.5] as const),
	]
}

const LOGO_ROWS = ASCII_LOGO.map(rowPixels)

/**
 * The CompSoc logo as a fastfetch "image logo": the half-block art from
 * ascii-logo.ts, drawn as SVG pixels so there are no seams between glyphs.
 * Sized in em to sit exactly on the text grid: each cell is 0.6em x 1em, the
 * JetBrains Mono advance at line-height 1. Each text row prints separately.
 */
function AsciiLogo({
	className,
	ref,
}: {
	className?: string
	ref?: Ref<SVGSVGElement>
}) {
	const width = ASCII_LOGO_COLS * 0.6
	return (
		<svg
			viewBox={`0 0 ${width} ${LOGO_ROWS.length}`}
			style={{
				width: `${width}em`,
				height: `${LOGO_ROWS.length}em`,
			}}
			ref={ref}
			shapeRendering="crispEdges"
			className={className}
			aria-hidden
		>
			{LOGO_ROWS.map((pixels, y) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: static generated art
				<g key={y} className="intro-print" style={row(y)}>
					{pixels.map(([pixel, x, w, dy]) => (
						<rect
							key={`${dy}-${x}`}
							x={x * 0.6}
							y={y + dy}
							width={w * 0.6}
							height={0.5}
							className={
								pixel === "a"
									? "fill-accent"
									: "fill-foreground"
							}
						/>
					))}
				</g>
			))}
		</svg>
	)
}

/**
 * Block cursor. Hollow when the window isn't focused, like kitty or foot.
 */
function Cursor({
	hollow = false,
	className,
}: {
	hollow?: boolean
	className?: string
}) {
	return (
		<span
			className={cn(
				"inline-block h-[1.15em] w-[0.6em] translate-y-[0.2em] border-2 border-foreground",
				hollow ? "bg-transparent" : "bg-foreground",
				className,
			)}
			aria-hidden
		/>
	)
}

/**
 * Skewed slab that slides in on hover. Shared by the CTA and the icon links so
 * the row reads as one set of controls.
 */
function HoverSlab({ group }: { group: "join" | "icon" }) {
	return (
		<span
			aria-hidden
			className={cn(
				"intro-covered absolute inset-y-0 -right-3 -left-3 -translate-x-full skew-x-[-20deg] bg-primary",
				"transition-transform duration-350 ease-[cubic-bezier(0.25,0.1,0.25,1)] motion-reduce:transition-none",
				group === "join"
					? "group-hover/join:translate-x-0 group-focus-visible/join:translate-x-0"
					: "group-hover/icon:translate-x-0 group-focus-visible/icon:translate-x-0",
			)}
		/>
	)
}

/** Entry sweep: the same slab passes over the button and uncovers it. */
function EntrySweep() {
	return (
		<span
			aria-hidden
			className="intro-sweep absolute inset-y-0 -right-3 -left-3 z-20 skew-x-[-20deg] bg-primary"
		/>
	)
}

function JoinButton() {
	const ref = useRef<HTMLAnchorElement>(null)
	// Kept small: the buttons sit 8px apart and must never overlap.
	useMagnetic(ref, 0.07)
	return (
		<a
			ref={ref}
			href="https://socs.universityofgalway.ie/societies/compsoc"
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"group/join relative inline-flex h-10 w-fit items-center overflow-hidden whitespace-nowrap rounded-md px-3 sm:px-4",
				"font-bold text-background outline-none",
				"focus-visible:ring-3 focus-visible:ring-ring/50",
			)}
			style={sweepAt(7)}
		>
			{/* Wrapped so the intro's animation doesn't replace the glow's. */}
			<span
				aria-hidden
				className="intro-covered absolute inset-0"
			>
				{/* Pulsing glow behind the accent fill */}
				<span className="absolute inset-0.5 animate-glow-border rounded-md bg-border-accent motion-reduce:animate-none" />
				<span className="absolute inset-0.5 rounded-sm bg-accent" />
			</span>
			<HoverSlab group="join" />
			<span className="intro-covered relative z-10">
				Join the society
			</span>
			<EntrySweep />
		</a>
	)
}

function IconLink({
	href,
	label,
	sweepRow,
	children,
}: {
	href: string
	label: string
	sweepRow: number
	children: ReactNode
}) {
	const ref = useRef<HTMLAnchorElement>(null)
	useMagnetic(ref, 0.18)
	return (
		<a
			ref={ref}
			href={href}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={label}
			className={cn(
				"group/icon relative inline-flex size-10 items-center justify-center overflow-hidden rounded-md",
				"text-foreground outline-none transition-colors duration-350",
				"hover:text-background focus-visible:text-background focus-visible:ring-3 focus-visible:ring-ring/50",
			)}
			style={sweepAt(sweepRow)}
		>
			{/* The frame is a layer, not the link's own border, so the hover slab
			    slides over it the way it does on the CTA. */}
			<span
				aria-hidden
				className="intro-covered absolute inset-0 rounded-md border-2 border-border bg-background/80 backdrop-blur-sm"
			/>
			<HoverSlab group="icon" />
			<span className="intro-covered relative z-10">
				{children}
			</span>
			<EntrySweep />
		</a>
	)
}

export default HeroSection
