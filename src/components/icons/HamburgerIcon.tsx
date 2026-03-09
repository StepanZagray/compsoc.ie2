// Custom hamburger menu icon with three SVG lines
import { motion } from "motion/react"

export function HamburgerMenuIcon({
	isOpen,
}: {
	isOpen: boolean
}) {
	return (
		<svg
			width="64"
			height="64"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="h-8! w-8! transition-transform duration-300"
			aria-label={isOpen ? "Close menu" : "Open menu"}
		>
			<title>{isOpen ? "Close menu" : "Open menu"}</title>
			<motion.path
				d="M4 8 L28 8"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				animate={{
					rotate: isOpen ? -45 : 0,
					y: isOpen ? 8 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: [0.4, 0, 0.2, 1],
				}}
				style={{ transformOrigin: "16px 8px" }}
			/>
			<motion.path
				d="M4 16 L28 16"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				animate={{
					scaleX: isOpen ? 0 : 1,
				}}
				transition={{
					duration: 0.3,
					ease: [0.4, 0, 0.2, 1],
				}}
			/>
			<motion.path
				d="M4 24 L28 24"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				animate={{
					rotate: isOpen ? 45 : 0,
					y: isOpen ? -8 : 0,
				}}
				transition={{
					duration: 0.3,
					ease: [0.4, 0, 0.2, 1],
				}}
				style={{ transformOrigin: "16px 24px" }}
			/>
		</svg>
	)
}
