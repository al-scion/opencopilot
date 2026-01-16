import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tailwindcss({ optimize: true }),
		tanstackRouter({ autoCodeSplitting: true, target: "react" }),
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		cloudflare(),
		tsConfigPaths(),
		mkcert(),
	],
	server: { port: 3000, strictPort: true },

	// The settings below is to fix issues with the streamdown package
	optimizeDeps: {
		exclude: ["vscode-jsonrpc", "langium"],
	},
	build: {
		rollupOptions: {
			external: ["vscode-jsonrpc", "langium"],
		},
	},
});
