import type { ReactNode } from "react"

/** Bordered panel: rounded border-2 border-border, matches hero/footer window style. */
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
					? `overflow-hidden rounded-md border-2 border-border bg-background/80 ${className}`
					: "overflow-hidden rounded-md border-2 border-border bg-background/80"
			}
		>
			{children}
		</div>
	)
}
