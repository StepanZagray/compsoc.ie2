import { createFileRoute } from "@tanstack/react-router"
import AboutSection from "#/components/sections/Home/AboutSection"
import HeroSection from "#/components/sections/Home/HeroSection"

export const Route = createFileRoute("/")({
	component: HomePage,
})

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center bg-background text-foreground">
			<HeroSection />
			<AboutSection />
		</div>
	)
}
