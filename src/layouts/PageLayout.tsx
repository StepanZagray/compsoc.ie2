import type { ReactNode } from "react"
import { cn } from "#/lib/utils"

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
			className={cn(
				"flex w-full max-w-6xl flex-col gap-4 bg-background px-4 pt-8 pb-4 text-foreground",
				className,
			)}
		>
			{children}
		</div>
	)
}
