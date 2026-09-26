/** Page heading: title + optional accent line and subtitle. */
export function PageTitle({
	title,
	subtitle,
}: {
	title: string
	subtitle?: string
}) {
	return (
		<div className="w-full">
			<h1 className="heading-1 mb-4">
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
