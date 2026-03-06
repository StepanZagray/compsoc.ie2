import { cn } from "#/lib/utils";

export function CompSocLogo({
	className,
}: {
	className?: string;
}) {
	return (
		<div
			className={cn(
				"relative flex h-full shrink-0 items-center justify-center gap-2 rounded-xl text-foreground-light",
				className,
			)}
		>
			<img
				src="/assets/img/compsoc_logo.png"
				alt=""
				className="relative h-10 object-contain"
			/>
			<div className="-mt-1 flex h-full flex-col items-center justify-center font-[Poppins,sans-serif]">
				<h1 className="font-medium text-[1.0625rem]">
					CompSoc
				</h1>
				<p className="-mt-1.5 font-light text-[0.5rem] opacity-75">
					University of Galway
				</p>
			</div>
		</div>
	);
}
