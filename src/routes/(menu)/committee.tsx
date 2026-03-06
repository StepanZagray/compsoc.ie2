import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(menu)/committee")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(menu)/committee"!</div>;
}
