import { createOpencodeClient } from "@opencode-ai/sdk/v2/client";
import { createAppRouter } from "@packages/app";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const port = await invoke<number>("ensure_server_started");

const opencodeClient = createOpencodeClient({
	baseUrl: `${import.meta.env.VITE_OPENCODE_BASE_URL}:${port}`,
});
const router = createAppRouter({
	platform: "desktop",
	queryClient: new QueryClient(),
	opencode: opencodeClient,
});

const App = () => {
	return <RouterProvider context={{}} router={router} />;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
