import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";
import "./index.css";

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const queryClient = new QueryClient();

export const router = createRouter({
	routeTree,
	defaultErrorComponent: (e) => <div>Error: {e.error.message}</div>,
	defaultNotFoundComponent: (props) => (
		<div>Route not found {JSON.stringify(props)}</div>
	),
	// defaultPendingComponent: () => <LoadingPage />,
	context: {
		queryClient,
	},
	Wrap: ({ children }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	),
});

const App = () => {
	return <RouterProvider context={{}} router={router} />;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
