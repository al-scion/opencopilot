import { createOpencodeClient } from "@opencode-ai/sdk/v2/client";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { env } from "./env";
import { createAppRouter } from "./router";

const opencodeClient = createOpencodeClient({
	baseUrl: env.VITE_OPENCODE_LOCAL_URL,
});

const router = createAppRouter({
	platform: "web",
	queryClient: new QueryClient(),
	opencode: opencodeClient,
});

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthKitProvider clientId={env.VITE_WORKOS_CLIENT_ID} redirectUri={undefined}>
			<RouterProvider router={router} />
		</AuthKitProvider>
	</StrictMode>
);
