import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import tsConfigPaths from "vite-tsconfig-paths";

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
	plugins: [
		tailwindcss(),
		tanstackRouter(),
		react({ babel: { plugins: ["babel-plugin-react-compiler"] } }),
		tsConfigPaths(),
		mkcert(),
	],
	esbuild: { keepNames: true }, // Improves production stack traces
	clearScreen: false, // prevent Vite from obscuring rust errors
	server: {
		port: 1420,
		host: host ?? false,
		strictPort: true, // 2. tauri expects a fixed port, fail if that port is not available
		watch: { ignored: ["**/src-tauri/**"] }, // 3. tell Vite to ignore watching `src-tauri`
		hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
	},
});
