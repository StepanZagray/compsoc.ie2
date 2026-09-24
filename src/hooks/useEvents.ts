import { useEffect, useState } from "react"
import {
	type EventsScope,
	type EventType,
	getEvents,
} from "#/services/events"

/**
 * Events for one snapshot scope, fetched once per page load and shared by
 * every caller. The snapshots only change on rebuild, so nothing is refetched.
 *
 * Only runs in the browser (inside an effect), so prerendered HTML and the
 * first client render both show the loading state and hydrate cleanly.
 */

const RETRY_DELAYS_MS = [1000, 2000, 4000]

const resolved = new Map<EventsScope, Array<EventType>>()
const pending = new Map<
	EventsScope,
	Promise<Array<EventType>>
>()

async function fetchWithRetry(
	scope: EventsScope,
): Promise<Array<EventType>> {
	for (let attempt = 0; ; attempt++) {
		try {
			return await getEvents(scope)
		} catch (error) {
			const delay = RETRY_DELAYS_MS[attempt]
			if (delay === undefined) throw error
			await new Promise((resolve) =>
				setTimeout(resolve, delay),
			)
		}
	}
}

function loadEvents(
	scope: EventsScope,
): Promise<Array<EventType>> {
	let request = pending.get(scope)
	if (!request) {
		request = fetchWithRetry(scope).then(
			(events) => {
				resolved.set(scope, events)
				return events
			},
			(error) => {
				// Let a later visit to the tab try again.
				pending.delete(scope)
				throw error
			},
		)
		pending.set(scope, request)
	}
	return request
}

type EventsState = {
	scope: EventsScope
	events?: Array<EventType>
	failed?: boolean
}

export function useEvents(scope: EventsScope) {
	const [state, setState] = useState<EventsState | null>(
		null,
	)

	useEffect(() => {
		// No early return for cached scopes: the fetch may have finished between
		// this render and the effect, and only setState re-renders the page.
		// A settled scope resolves from `pending` without a network request.
		let active = true
		loadEvents(scope).then(
			(events) => {
				if (active) setState({ scope, events })
			},
			() => {
				if (active) setState({ scope, failed: true })
			},
		)
		return () => {
			active = false
		}
	}, [scope])

	// A scope fetched earlier renders straight from the cache, without a
	// loading frame. The cache is empty during hydration, so this never
	// disagrees with the prerendered HTML.
	const cached = resolved.get(scope)
	const current = state?.scope === scope ? state : null
	const events = cached ?? current?.events
	return {
		events: events ?? [],
		isLoading: !events && !current?.failed,
		isError: !events && !!current?.failed,
	}
}
