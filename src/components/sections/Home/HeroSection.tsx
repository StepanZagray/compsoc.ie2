import { motion } from "motion/react"
import { useEffect, useRef } from "react"
import heroImg from "#/assets/img/university/UoG.jpg?format=webp"
import { useActiveSection } from "#/contexts/active-section"
import { useTypewriter } from "#/hooks/useTypewriter"

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

	const strarray = [
		"Computer",
		"Developer",
		"Technology",
		"AI",
		"Cybersecurity",
	]
	const text = useTypewriter(strarray, 75, 1000, active)

	return (
		<section
			ref={sectionRef}
			className="relative flex h-[calc(100vh-4rem)] w-full items-center justify-center overflow-hidden"
			onTouchEnd={() => setTapOverride("hero")}
		>
			{/* Background photo clipped in a rounded window */}
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-[calc(50%)] left-1/2 z-0">
				<div className="relative h-[calc(100vh-4rem-1rem)] w-[calc(100vw-1rem)] overflow-hidden rounded-md md:h-[calc(100vh-4rem-2rem)] md:w-[calc(100vw-2rem)]">
					<img
						src={heroImg}
						alt=""
						aria-hidden
						className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 min-h-full w-3xl min-w-full select-none object-cover opacity-40"
					/>
				</div>
			</div>

			{/* Hero content */}
			<div className="relative z-20 flex w-fit max-w-3xl flex-col justify-center">
				<h1 className="mb-4 flex w-fit flex-col font-bold text-[36px]/10 md:flex-row md:text-5xl">
					<span>
						University of
						<span className="hidden md:inline">&nbsp;</span>
					</span>
					<span>Galway's</span>
				</h1>

				<p className="flex flex-wrap items-center gap-x-0.5 text-xl md:text-2xl">
					<span className="relative">
						{text.split("").map((char, i) => (
							<span
								key={`${String(i).padStart(3, "0")}-${char}`}
								className="relative inline-block"
							>
								{char === " " ? (
									<span>&nbsp;</span>
								) : (
									<span>{char}</span>
								)}
							</span>
						))}
					</span>
					<span
						className="ml-px inline-block h-[1em] w-[0.5em] align-middle text-foreground"
						style={
							active
								? {
										backgroundColor: "currentColor",
									}
								: {
										border: "2px solid currentColor",
										backgroundColor: "transparent",
									}
						}
					/>
					<span> Society</span>
				</p>
			</div>
			{/* Terminal window */}
			<div className="-translate-y-1/2 -translate-x-1/2 absolute top-[calc(50%)] left-1/2 z-10">
				<div
					className="absolute inset-0 z-0 rounded-md backdrop-blur-sm"
					aria-hidden
				/>
				{/* terminal prompt */}
				<p className="absolute top-4 left-4 z-20 text-sm md:top-5 md:left-5 md:text-base">
					<span className="text-accent">~ ❯</span> compsoc
				</p>
				<motion.div
					className="relative z-10 h-[calc(100vh-4rem-1rem)] w-[calc(100vw-1rem)] overflow-hidden rounded-md border-2 bg-background/80 px-3.5 py-3 shadow-2xl md:h-[calc(100vh-4rem-2rem)] md:w-[calc(100vw-2rem)] md:px-5 md:py-4"
					animate={active ? activeVariant : inactiveVariant}
					transition={transition}
				></motion.div>
			</div>
		</section>
	)
}

export default HeroSection
