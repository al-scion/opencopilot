import { ConvexQueryClient } from "@convex-dev/react-query";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initWorkbook } from "./lib/excel/_init";
import { createAppRouter } from "./router";

const convexReactClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
const convexQueryClient = new ConvexQueryClient(convexReactClient);
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});
convexQueryClient.connect(queryClient);

export const router = createAppRouter({
	queryClient,
	convexReactClient,
	convexQueryClient,
	auth: undefined!,
});

console.log(Office.context);
if (
	Office.context?.platform === Office.PlatformType.Mac ||
	Office.context?.platform === Office.PlatformType.PC ||
	(Office.context?.platform === Office.PlatformType.OfficeOnline && !window.location.pathname.startsWith("/auth"))
) {
	await initWorkbook();
}

function App() {
	const auth = useAuth();
	if (auth.isLoading) {
		return null;
	}
	return <RouterProvider context={{ auth }} router={router} />;
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthKitProvider
			clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
			redirectUri={`${window.location.origin}/auth/callback`}
		>
			<App />
		</AuthKitProvider>
	</StrictMode>
);
