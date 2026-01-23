import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";

// https://astro.build/config
export default defineConfig({
	output: "static",
	site: "https://usefabric.xyz",
	adapter: cloudflare({ imageService: "compile" }),
	prefetch: { prefetchAll: true, defaultStrategy: "viewport" },
	env: {
		schema: {
			WEB_EXTENSION_ID: envField.string({
				access: "public",
				context: "client",
			}),
			WORKOS_CLIENT_ID: envField.string({
				access: "public",
				context: "client",
			}),
		},
	},
	integrations: [mdx(), sitemap()],
	vite: {
		plugins: [tailwindcss({ optimize: true })],
	},
});
