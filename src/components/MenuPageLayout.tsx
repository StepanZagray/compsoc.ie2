import type { ReactNode } from "react"

/** Wrapper for menu routes: clears nav (h-16), consistent background and spacing. */
export function MenuPageLayout({
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

/** Page heading matching About/constitution: title + optional accent line. */
export function MenuPageTitle({
	title,
	subtitle,
}: {
	title: string
	subtitle?: string
}) {
	return (
		<div className="mb-8 w-full md:mb-10">
			<h1 className="font-bold text-3xl tracking-tight md:text-4xl">
				{title}
				<span className="mt-3 block h-0.5 w-16 rounded-full bg-accent" />
			</h1>
			{subtitle && (
				<p className="mt-2 text-muted-foreground text-sm leading-6">
					{subtitle}
				</p>
			)}
		</div>
	)
}

/** Panel matching hero/footer window: rounded border-2 border-border. */
export function MenuPanel({
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
