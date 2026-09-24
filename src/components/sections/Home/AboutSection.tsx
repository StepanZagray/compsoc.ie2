import { Link } from "@tanstack/react-router"
import { type ReactNode, useEffect, useRef } from "react"
import uog from "#/assets/img/university/UoG.jpg?format=webp&w=480;768;1000&as=img"
import uog2 from "#/assets/img/university/UoG2.jpg?format=webp&w=640;1024;1400&as=img"
import uog3 from "#/assets/img/university/UoG3.jpg?format=webp&w=480;768;1000&as=img"
import uog4 from "#/assets/img/university/UoG4.jpg?format=webp&w=480;768;1000&as=img"
import { sectionStyle } from "#/constants/section-variants"
import {
	type SectionId,
	useActiveSection,
} from "#/contexts/active-section"
import { useScrollWindow } from "#/hooks/useScrollWindow"
import { cn } from "#/lib/utils"

type SectionMotionProps = {
	activeVariant: { borderColor: string; opacity: number }
	inactiveVariant: { borderColor: string; opacity: number }
	transition: {
		duration: number
		ease: [number, number, number, number]
	}
}

type Picture = {
	src: string
	srcset?: string
	w: number
	h: number
}

const WIDE =
	"(min-width: 1024px) 66vw, (min-width: 768px) 50vw, 100vw"
const NARROW =
	"(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"

/**
 * About is a Hyprland workspace: small terminals `cat`-ing each part of the
 * story, tiled with image-viewer windows. Each row is its own section, so the
 * page's active-section logic handles it like any other window: the active
 * row is at full opacity and its terminal has the accent border.
 */
const AboutSection = (props: SectionMotionProps) => (
	<>
		<AboutRow id="about-who" {...props}>
			{(active) => (
				<>
					<TerminalTile
						file="who-we-are.md"
						title="Who we are"
						focused={active}
					>
						CompSoc is University of Galway's Computer and
						Networking Society. We host events for
						everything computing related from how to setup
						your own blog to System Administration and
						Programming Tutorials. We also host a number of
						services on our Society run servers for our
						members. CompSoc is the oldest computer-related
						society in Ireland, while many Alumni believe it
						was much earlier, was formally established in
						1977 during the days that the University was
						known as UCG.
					</TerminalTile>
					<ImageTile
						picture={uog2}
						sizes={WIDE}
						alt="University of Galway campus from the air"
						className="lg:col-span-2"
					/>
				</>
			)}
		</AboutRow>

		<AboutRow id="about-mission" {...props}>
			{(active) => (
				<>
					<ImageTile
						picture={uog3}
						sizes={NARROW}
						alt="Cherry blossom on campus"
						className="hidden lg:block"
					/>
					<TerminalTile
						file="mission.md"
						title="Our mission"
						focused={active}
					>
						CompSoc's main goal is to try and foster a love
						and passion for all things technology related in
						University of Galway. We host a wide variety of
						events to work towards this goal, including
						workshops about Linux, hardware and programming.
						Our aims is to "promote and increase awareness
						of electronic communication and related computer
						systems, a forum to discuss and gain experience
						in computer networking and systems and to help
						educate people in the usage of Internet
						utilities and resources".
					</TerminalTile>
					<ImageTile
						picture={uog4}
						sizes={NARROW}
						alt="University of Galway grounds"
					/>
				</>
			)}
		</AboutRow>

		<AboutRow id="about-constitution" {...props}>
			{(active) => (
				<>
					<ImageTile
						picture={uog}
						sizes={WIDE}
						alt="University of Galway Quadrangle"
						// After the text on phones; beside it (first) from md up.
						className="max-md:order-last lg:col-span-2"
					/>
					<TerminalTile
						file="constitution.md"
						title="Our constitution"
						focused={active}
					>
						You can{" "}
						<Link
							className="font-semibold text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
							to="/constitution/"
						>
							read the CompSoc constitution
						</Link>
						, as ratified by the USCG (
						<span className="italic">
							"University Societies Coordination Group"
						</span>
						) on 27th May, 2022.
					</TerminalTile>
				</>
			)}
		</AboutRow>
	</>
)

/** One row of the About workspace, registered as its own section. */
function AboutRow({
	id,
	activeVariant,
	inactiveVariant,
	transition,
	children,
}: SectionMotionProps & {
	id: SectionId
	children: (active: boolean) => ReactNode
}) {
	const ref = useRef<HTMLElement>(null)
	useScrollWindow(ref)
	const {
		activeSectionId,
		registerSection,
		setTapOverride,
	} = useActiveSection()
	const active = activeSectionId === id
	const { opacity, transition: fade } = sectionStyle(
		active,
		activeVariant,
		inactiveVariant,
		transition,
	)

	useEffect(
		() => registerSection(id, ref),
		[registerSection, id],
	)

	return (
		<section
			ref={ref}
			className="relative z-10 mb-4 w-full px-4"
			onTouchEnd={() => setTapOverride(id)}
		>
			{/* Dimming lives here, not on the section: the section's opacity
			    belongs to the scroll popin (useScrollWindow). */}
			<div
				className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
				style={{ opacity, transition: fade }}
			>
				{children(active)}
			</div>
		</section>
	)
}

/** A small terminal window that has just run `cat <file>`. */
function TerminalTile({
	file,
	title,
	focused = false,
	className,
	children,
}: {
	file: string
	title: string
	focused?: boolean
	className?: string
	children: ReactNode
}) {
	return (
		<article
			className={cn(
				"tile rounded-md border-2 bg-background/80 p-4 md:p-6",
				className,
			)}
			data-focused={focused || undefined}
		>
			<p className="text-muted-foreground text-sm">
				<span className="text-accent">~ ❯</span> cat {file}
			</p>
			{/* Rendered the way glow shows markdown: the heading keeps its hashes. */}
			<h2 className="heading-2 mt-4 mb-2">
				<span className="text-accent" aria-hidden>
					##{" "}
				</span>
				{title}
			</h2>
			<p className="text-muted-foreground text-sm leading-7">
				{children}
			</p>
		</article>
	)
}

/** An image viewer window: nothing but the picture. */
function ImageTile({
	picture,
	sizes,
	alt,
	className,
}: {
	picture: Picture
	sizes: string
	alt: string
	className?: string
}) {
	return (
		<figure
			className={cn(
				"tile relative aspect-4/3 overflow-hidden rounded-md border-2 md:aspect-auto md:min-h-64",
				className,
			)}
		>
			<img
				src={picture.src}
				srcSet={picture.srcset}
				sizes={sizes}
				width={picture.w}
				height={picture.h}
				alt={alt}
				loading="lazy"
				decoding="async"
				className="absolute inset-0 h-full w-full object-cover"
			/>
			{/* Tones the photos down to sit in the dark theme. */}
			<div
				className="pointer-events-none absolute inset-0 bg-black/25"
				aria-hidden
			/>
		</figure>
	)
}

export default AboutSection
