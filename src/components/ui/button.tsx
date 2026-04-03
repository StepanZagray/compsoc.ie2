import { Button as ButtonPrimitive } from "@base-ui/react/button"
import {
	cva,
	type VariantProps,
} from "class-variance-authority"

import { cn } from "#/lib/utils"

const buttonVariants = cva(
	"group/button inline-flex shrink-0 items-center justify-center rounded-md border-2 cursor-pointer border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/80 data-[active=true]:hover:bg-primary aria-[pressed=true]:hover:bg-primary",
				outline:
					"border-border bg-background shadow-xs text-foreground hover:border-border-secondary hover:shadow-xs aria-expanded:bg-muted aria-expanded:text-foreground data-[active=true]:bg-muted data-[active=true]:border-border data-[active=true]:hover:border-border data-[active=true]:hover:shadow-xs data-[active=true]:hover:bg-muted aria-[pressed=true]:bg-muted aria-[pressed=true]:border-border aria-[pressed=true]:hover:border-border aria-[pressed=true]:hover:shadow-xs aria-[pressed=true]:hover:bg-muted",
				secondary:
					"border-border bg-background shadow-xs text-foreground hover:border-border-secondary hover:shadow-xs aria-expanded:bg-muted aria-expanded:text-foreground data-[active=true]:bg-muted data-[active=true]:border-border data-[active=true]:hover:border-border data-[active=true]:hover:shadow-xs data-[active=true]:hover:bg-muted aria-[pressed=true]:bg-muted aria-[pressed=true]:border-border aria-[pressed=true]:hover:border-border aria-[pressed=true]:hover:shadow-xs aria-[pressed=true]:hover:bg-muted",

				ghost:
					"hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 data-[active=true]:hover:bg-muted aria-[pressed=true]:hover:bg-muted dark:data-[active=true]:hover:bg-muted/50 dark:aria-[pressed=true]:hover:bg-muted/50",
				destructive:
					"bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40 data-[active=true]:hover:bg-destructive/10 dark:data-[active=true]:hover:bg-destructive/20 aria-[pressed=true]:hover:bg-destructive/10 dark:aria-[pressed=true]:hover:bg-destructive/20",
				link: "text-primary underline-offset-4 hover:underline data-[active=true]:hover:underline aria-[pressed=true]:hover:underline",
				transperent:
					"bg-transperent hover:text-accent-foreground data-[active=true]:hover:text-accent-foreground aria-[pressed=true]:hover:text-accent-foreground",
			},
			size: {
				default:
					"h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
				xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
				lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
				icon: "size-9",
				"icon-xs":
					"size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm":
					"size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
				"icon-lg": "size-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
)

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props &
	VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(
				buttonVariants({ variant, size, className }),
			)}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
