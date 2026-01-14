import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [
		tailwindcss(),
		// tanstackRouter({ autoCodeSplitting: true, target: "react" }),
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		tsConfigPaths({ projects: ["./tsconfig.json"] }),
	],
	clearScreen: false,
	esbuild: {
		keepNames: true,
	},
	server: {
		port: 1420,
		strictPort: true,
		host,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			ignored: ["**/src-tauri/**"],
		},
	},
});
