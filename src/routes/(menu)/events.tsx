import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/(menu)/events")({
	component: RouteComponent,
})

function RouteComponent() {
	return <div>Hello "/(menu)/events"!</div>
}
