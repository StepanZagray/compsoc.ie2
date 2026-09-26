import type { ReactNode } from "react"

/**
 * Bordered panel: rounded border-2 border-border, matches hero/footer window
 * style. Outside the home page windows are focused by the cursor, so the
 * border takes the accent on hover, like Card.
 */
export function Panel({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={
				className
					? `overflow-hidden rounded-md border-2 border-border bg-background/80 transition-colors duration-300 hover:border-border-accent ${className}`
					: "overflow-hidden rounded-md border-2 border-border bg-background/80 transition-colors duration-300 hover:border-border-accent"
			}
		>
			{children}
		</div>
	)
}
