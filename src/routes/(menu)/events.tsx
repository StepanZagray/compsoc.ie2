import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import {
	Calendar,
	ExternalLink,
	MapPin,
} from "lucide-react"
import { useState } from "react"
import {
	MenuPageLayout,
	MenuPageTitle,
	MenuPanel,
} from "#/components/MenuPageLayout"
import { buttonVariants } from "#/components/ui/button"
import { cn } from "#/lib/utils"
import {
	type EventType,
	getPastEvents,
	getUpcomingEvents,
} from "#/services/events"

export const Route = createFileRoute("/(menu)/events")({
	component: RouteComponent,
})

function RouteComponent() {
	const [activeTab, setActiveTab] = useState<
		"upcoming" | "past"
	>("upcoming")

	const {
		data: upcoming = [],
		isLoading: loadingUpcoming,
	} = useQuery({
		queryKey: ["events", "upcoming"],
		queryFn: getUpcomingEvents,
	})
	const { data: past = [], isLoading: loadingPast } =
		useQuery({
			queryKey: ["events", "past"],
			queryFn: getPastEvents,
		})

	const events = activeTab === "upcoming" ? upcoming : past
	const loading =
		activeTab === "upcoming" ? loadingUpcoming : loadingPast

	return (
		<MenuPageLayout>
			<div className="w-full max-w-4xl px-4">
				<MenuPageTitle
					title="Events"
					subtitle="Discover upcoming events and explore our past activities."
				/>

				{/* Tabs */}
				<div className="mb-6 flex gap-1 rounded-md border-2 border-border bg-background/80 p-1">
					<button
						type="button"
						onClick={() => setActiveTab("upcoming")}
						className={`flex-1 rounded px-4 py-2 font-medium text-sm transition-colors ${
							activeTab === "upcoming"
								? "bg-foreground text-background"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Upcoming
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("past")}
						className={`flex-1 rounded px-4 py-2 font-medium text-sm transition-colors ${
							activeTab === "past"
								? "bg-foreground text-background"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						Past
					</button>
				</div>

				{/* Events list */}
				<div className="space-y-4">
					{loading ? (
						<MenuPanel className="p-8">
							<p className="text-center text-muted-foreground text-sm">
								Loading events…
							</p>
						</MenuPanel>
					) : events.length === 0 ? (
						<MenuPanel className="p-8">
							<p className="text-center text-muted-foreground text-sm">
								{activeTab === "upcoming"
									? "No upcoming events at the moment. Check back soon."
									: "No past events to display."}
							</p>
						</MenuPanel>
					) : (
						events.map((event) => (
							<EventCard
								key={`${event.EventID}-${event.EventDetailsID}`}
								event={event}
							/>
						))
					)}
				</div>
			</div>
		</MenuPageLayout>
	)
}

function EventCard({ event }: { event: EventType }) {
	const title = decodeHtml(event.Title)
	return (
		<MenuPanel>
			<div className="border-border border-b-2 p-6">
				<h3 className="font-bold text-foreground">
					{title}
				</h3>
				<div className="mt-2 flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
					<span className="inline-flex items-center gap-1.5">
						<Calendar className="size-4" />
						{event.DatetimeFormatted}
					</span>
					{event.Location && (
						<span className="inline-flex items-center gap-1.5">
							<MapPin className="size-4" />
							{event.Location}
						</span>
					)}
				</div>
			</div>
			<div
				className="prose prose-sm dark:prose-invert max-w-none p-6 text-muted-foreground [&_a]:text-accent"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: event content from API
				dangerouslySetInnerHTML={{
					__html: event.DangerousDescriptionHTML,
				}}
			/>
			<div className="border-border border-t-2 p-6">
				<a
					href={event.EventURL}
					target="_blank"
					rel="noopener noreferrer"
					className={cn(
						buttonVariants({
							variant: "outline",
							size: "sm",
						}),
						"inline-flex items-center gap-2",
					)}
				>
					View / Join event
					<ExternalLink className="size-4" />
				</a>
			</div>
		</MenuPanel>
	)
}

function decodeHtml(html: string) {
	const textarea = document.createElement("textarea")
	textarea.innerHTML = html
	return textarea.value
}
