import { createFileRoute } from "@tanstack/react-router";
import AboutSection from "#/components/sections/Home/AboutSection";
import HeroSection from "#/components/sections/Home/HeroSection";
import InfographicSection from "#/components/sections/Home/InfographicSection";
export const Route = createFileRoute("/")({
	component: HomePage,
});

const _STATS = [
	{ value: "48", label: "years established" },
	{ value: "1,388", label: "members and growing" },
	{ value: "7", label: "committee members" },
	{ value: "5", label: "GB free server space" },
];

function HomePage() {
	return (
		<div className="flex min-h-screen flex-col items-center bg-background text-foreground">
			<HeroSection />
			<AboutSection />
			<InfographicSection />
		</div>
	);
}
