import type { ReactNode } from "react"

/** Wrapper for page content: clears nav (h-16), consistent background and spacing. */
export function PageLayout({
	children,
	className,
}: {
	children: ReactNode
	className?: string
}) {
	return (
		<div
			className={`flex w-full max-w-6xl flex-col bg-background px-4 pt-20 pb-16 text-foreground ${className}`}
		>
			{children}
		</div>
	)
}
