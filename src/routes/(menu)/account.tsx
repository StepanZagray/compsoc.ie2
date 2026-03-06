import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(menu)/account")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(menu)/account"!</div>;
}
