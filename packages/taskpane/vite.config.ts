import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { registerAddIn, sideloadAddIn, unregisterAddIn, unregisterAllAddIns } from "office-addin-dev-settings";
import { defineConfig, type Plugin } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";
import { getCustomFunctionsConfig, getShortcutsConfig } from "../shared/src/excel/config";

const officePlugin = (): Plugin => ({
	name: "officePlugin",
	apply: "serve",
	configureServer: async (server) => {
		const root = server.config.root;
		const configDir = path.join(root, "public", "config");
		const manifestPath = path.join(root, "manifest-dev.xml");

		const shortcuts = JSON.stringify(getShortcutsConfig(), null, 2);
		const customFunctions = JSON.stringify(getCustomFunctionsConfig(), null, 2);

		console.log("Writing office config files");
		await mkdir(configDir, { recursive: true });
		await writeFile(path.join(configDir, "shortcuts.json"), shortcuts);
		await writeFile(path.join(configDir, "functions.json"), customFunctions);

		server.httpServer?.once("listening", async () => {
			console.log("listening");
			await sideloadAddIn(manifestPath);
		});

		server.httpServer?.once("close", async () => {
			await unregisterAddIn(manifestPath).then(() => console.log("removed manifest"));
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
