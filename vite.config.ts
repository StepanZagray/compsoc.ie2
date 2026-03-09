import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import netlify from "@netlify/vite-plugin-tanstack-start"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { imagetools } from "vite-imagetools"
import tsconfigPaths from "vite-tsconfig-paths"

// Full SSG for Cloudflare Pages: static output in dist/client (no Workers/Wrangler).
const config = defineConfig({
	plugins: [
		devtools(),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		imagetools(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				autoStaticPathsDiscovery: true,
				crawlLinks: true,
			},
		}),
		netlify(),
		viteReact({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
})

export default config
