import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		cloudflare({ viteEnvironment: { name: "ssr" } }),
		mdx(await import("./source.config")),
		tailwindcss({ optimize: true }),
		tsConfigPaths({ projects: ["./tsconfig.json", "../ui/tsconfig.json"] }),
		tanstackStart({
			prerender: { enabled: true, crawlLinks: true, autoStaticPathsDiscovery: true, autoSubfolderIndex: true },
			pages: [{ path: "/docs" }, { path: "/api/search" }],
		}),
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
	],
});
