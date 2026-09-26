import logoUrl from "#/assets/img/compsoc/compsoc_logo.png?format=webp&w=100"
import { cn } from "#/lib/utils"

export function CompSocLogo({
	className,
}: {
	className?: string
}) {
	return (
		<div
			className={cn(
				"relative flex h-full shrink-0 items-center justify-center gap-2 rounded-xl text-foreground-light",
				className,
			)}
		>
			<img
				src={logoUrl}
				alt=""
				className="relative h-10 object-contain"
			/>
			<div className="nav-wordmark relative -mt-1 flex h-full flex-col items-center justify-center font-[Poppins,sans-serif]">
				{/* Dims the wordmark while the home hero has the logo; the
				    logo flight wipes it away (see useLogoFlight). */}
				<span
					className="nav-wordmark-shade pointer-events-none absolute inset-y-0 left-0 z-10 w-full bg-background/45 opacity-0"
					aria-hidden
				/>
				<span className="font-medium text-[1.0625rem]">
					CompSoc
				</span>
				<p className="-mt-1.5 font-light text-[0.5rem] opacity-75">
					University of Galway
				</p>
			</div>
		</div>
	)
}
