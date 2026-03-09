import { Link } from "@tanstack/react-router"

export function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-foreground">
			<h1 className="font-bold text-4xl">404</h1>
			<p className="text-center text-muted-foreground">
				This page doesn’t exist or has been moved.
			</p>
			<Link
				to="/"
				className="font-medium text-accent underline underline-offset-2 transition-colors hover:text-accent/80"
			>
				Back to home
			</Link>
		</div>
	)
}
