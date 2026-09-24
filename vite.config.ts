import { readFileSync } from "node:fs"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { imagetools } from "vite-imagetools"

// Full SSG for Cloudflare Pages: static output in dist/client.

// The home page infographic needs only the current committee headcount. Inlining
// it here keeps the committee dataset out of every bundle but the committee route.
const committee = JSON.parse(
	readFileSync("./src/services/committee.json", "utf8"),
) as { committee_years: Array<{ committee: unknown[] }> }

// Events hosted, for the home page's stats window, from the snapshot that
// scripts/sync-events.mjs refreshes before every build.
const eventSnapshot = JSON.parse(
	readFileSync("./public/events.json", "utf8"),
) as { events: Array<{ StartDatetime: string }> }
const eventStats = {
	total: eventSnapshot.events.length,
	since: Math.min(
		...eventSnapshot.events.map(({ StartDatetime }) =>
			new Date(StartDatetime).getUTCFullYear(),
		),
	),
}

const committeeSize = String(
	committee.committee_years[0].committee.length,
)
const config = defineConfig({
	define: {
		__COMMITTEE_SIZE__: JSON.stringify(committeeSize),
		// Prerendered HTML and the client must agree, or React re-renders the
		// whole page (replaying the home intro) when the year turns before a rebuild.
		__EVENT_STATS__: JSON.stringify(eventStats),
		__BUILD_YEAR__: JSON.stringify(
			new Date().getFullYear(),
		),
	},
	resolve: {
		tsconfigPaths: true,
	},
	plugins: [
		devtools(),
		imagetools(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				autoStaticPathsDiscovery: true,
				crawlLinks: true,
			},
		}),
		viteReact(),
	],
})

export default config
