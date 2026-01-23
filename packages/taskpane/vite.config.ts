import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { sideloadAddIn, unregisterAddIn } from "office-addin-dev-settings";
import { defineConfig, type Plugin } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";

const officePlugin = ({ manifestPath }: { manifestPath: string }): Plugin => ({
	name: "officePlugin",
	configureServer: async (server) => {
		const root = server.config.root;
		const resolvedManifestPath = path.join(root, manifestPath);

		server.httpServer?.once("listening", async () => {
			console.log("listening");
			await sideloadAddIn(resolvedManifestPath);
		});

		server.httpServer?.once("close", async () => {
			await unregisterAddIn(resolvedManifestPath).then(() => console.log("removed manifest"));
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
		officePlugin({ manifestPath: "manifest-dev.xml" }),
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
