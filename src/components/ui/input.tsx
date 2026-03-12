import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "#/lib/utils"

function Input({
	className,
	type,
	...props
}: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				"h-9 w-full min-w-0 rounded-md border-2 border-input bg-transparent px-2.5 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground focus-visible:border-border-accent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm",
				className,
			)}
			{...props}
		/>
	)
}

export { Input }
