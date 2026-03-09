/**
 * Active/inactive variants for section motion (border, opacity). Shared by Hero, About, Footer.
 * Border colors must match src/styles.css (--border-sky and .dark --border) so animations
 * interpolate without flicker. When changing these, update the CSS variables too.
 */
export const sectionVariants = {
	active: {
		borderColor: "oklch(0.828 0.111 230.318)",
		opacity: 1,
	},
	inactive: {
		borderColor: "oklch(0.278 0.033 256.848)",
		opacity: 0.8,
	},
	transition: {
		duration: 0.35,
		ease: [0.25, 0.1, 0.25, 1] as [
			number,
			number,
			number,
			number,
		],
	},
}

/** Active border color for nav bottom border when menu is active. */
export const sectionActiveBorderColor =
	sectionVariants.active.borderColor as string
