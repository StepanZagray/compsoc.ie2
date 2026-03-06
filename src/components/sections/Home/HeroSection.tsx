import { useInView } from "motion/react";
import { useRef } from "react";
import { useTypewriter } from "#/hooks/useTypewriter";

const HeroSection = () => {
	const sectionRef = useRef<HTMLElement>(null);
	const inView = useInView(sectionRef, { amount: 0.7 });
	const strarray = [
		"Computer",
		"Developer",
		"Technology",
		"AI",
		"Cybersecurity",
	];
	const text = useTypewriter(strarray, 75, 1000, inView);
	return (
		<section
			ref={sectionRef}
			className="relative flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 pt-16"
		>
			<div className="w-content">
				<h1 className="mb-4 font-bold text-4xl md:text-5xl">
					University of Galway's
				</h1>
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
								? { backgroundColor: "currentColor" }
								: {
										border: "2px solid currentColor",
										backgroundColor: "transparent",
									}
						}
					/>
					<span> Society</span>
				</p>
			</div>
		</section>
	);
};

export default HeroSection;
