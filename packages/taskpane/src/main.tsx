import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LoadingPage } from "./components/loading-page";
import { routeTree } from "./routeTree.gen";
import "./index.css";

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

export const router = createRouter({
	routeTree,
	defaultErrorComponent: (e) => <div>Error: {e.error.message}</div>,
	defaultNotFoundComponent: (props) => <div>Route not found {JSON.stringify(props)}</div>,
	defaultPendingComponent: () => <LoadingPage />,
	context: {
		queryClient,
		convexReactClient,
		convexQueryClient,
		auth: undefined!, // Will be set in react land!!
	},
	Wrap: ({ children }) => (
		<ConvexProviderWithAuthKit client={convexReactClient} useAuth={useAuth}>
			<ConvexProvider client={convexReactClient}>
				<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
			</ConvexProvider>
		</ConvexProviderWithAuthKit>
	),
});

function App() {
	const auth = useAuth();
	return <RouterProvider context={{ auth }} router={router} />;
}

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthKitProvider clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}>
			<App />
		</AuthKitProvider>
	</StrictMode>
);
