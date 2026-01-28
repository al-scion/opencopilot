import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { sideloadAddIn } from "office-addin-dev-settings";
import { defineConfig, type Plugin } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";

const officePlugin = (): Plugin => ({
	name: "officePlugin",
	apply: "serve",
	configureServer: async (server) => {
		const root = server.config.root;
		const manifestPath = path.join(root, "manifest-dev.xml");
		server.httpServer?.once("listening", async () => {
			await sideloadAddIn(manifestPath);
		});
	},
});

export default defineConfig({
	plugins: [
		tailwindcss({ optimize: true }),
		tanstackRouter({ autoCodeSplitting: true, target: "react" }),
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		tsConfigPaths({ projects: ["./tsconfig.json", "../ui/tsconfig.json"] }),
		cloudflare(),
		mkcert(),
		officePlugin(),
	],
	server: {
		port: 3000,
		strictPort: true,
		proxy: {
			"/api": {
				target: "http://localhost:8787",
				changeOrigin: true,
				secure: false,
				rewrite: (path) => path.replace(/^\/api/, ""),
			},
		},
	},

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
