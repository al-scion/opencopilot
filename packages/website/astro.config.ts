import cloudflare from "@astrojs/cloudflare";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
	adapter: cloudflare({ imageService: "passthrough", platformProxy: { enabled: true } }),
	integrations: [mdx(), sitemap()],
	server: {
		port: 3002,
	},
});
