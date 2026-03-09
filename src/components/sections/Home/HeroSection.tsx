import { motion, useInView } from "motion/react"
import { useRef } from "react"
import heroImg from "#/assets/img/university/UoG.jpg?format=webp"
import { useTypewriter } from "#/hooks/useTypewriter"

const BORDER_SKY = "oklch(0.828 0.111 230.318)"
const BORDER = "oklch(0.278 0.033 256.848)"

const HeroSection = () => {
	const sectionRef = useRef<HTMLElement>(null)
	const inView = useInView(sectionRef, { amount: 0.8 })
	const strarray = [
		"Computer",
		"Developer",
		"Technology",
		"AI",
		"Cybersecurity",
	]
	const text = useTypewriter(strarray, 75, 1000, inView)

	return (
		<section
			ref={sectionRef}
			className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-2"
		>
			{/* Background photo clipped in a rounded window */}
			<div className="-translate-x-1/2 -translate-y-1/2 absolute top-[calc(50%+1.75rem)] left-1/2 z-0">
				<div className="relative h-[calc(100vh-3.5rem-2rem)] w-[calc(100vw-2rem)] overflow-hidden rounded-md">
					<img
						src={heroImg}
						alt=""
						aria-hidden
						className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 min-h-full w-3xl min-w-full select-none object-cover opacity-40"
					/>
				</div>
			</div>

			{/* Hero content */}
			<div className="relative z-10 flex w-fit max-w-3xl flex-col items-center justify-center">
				<h1 className="mb-4 flex w-fit flex-col font-bold text-[42px]/11 md:flex-row md:text-5xl">
					<span>
						University of
						<span className="hidden md:inline">&nbsp;</span>
					</span>
					<span>Galway's</span>
				</h1>
				{/* Terminal window */}
				<div className="relative w-full min-w-84">
					<div
						className="absolute inset-0 z-0 rounded-md backdrop-blur-md"
						aria-hidden
					/>
					<motion.div
						className="relative z-10 w-full overflow-hidden rounded-md border-2 bg-background/80 px-3.5 py-3 shadow-2xl md:px-5 md:py-4"
						animate={{
							borderColor: inView ? BORDER_SKY : BORDER,
							opacity: inView ? 1 : 0.8,
						}}
						transition={{
							duration: 0.35,
							ease: [0.25, 0.1, 0.25, 1],
						}}
					>
						<p className="flex flex-wrap items-center gap-x-0.5 text-xl">
							<span className="text-accent">~ ❯&nbsp;</span>
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
									inView
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
					</motion.div>
				</div>
			</div>
		</section>
	)
}

export default HeroSection
