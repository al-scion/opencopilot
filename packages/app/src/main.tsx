import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { RouterContext } from "./routes/__root";
import { routeTree } from "./routeTree.gen";
import "./index.css";

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createAppRouter>;
	}
}

export const createAppRouter = (context: RouterContext) =>
	createRouter({
		routeTree,
		defaultErrorComponent: (e) => <div>Error: {e.error.message}</div>,
		defaultNotFoundComponent: (props) => <div>Not found {props.routeId}</div>,
		defaultPendingComponent: () => <div>Loading...</div>,
		context,
		Wrap: ({ children }) => <QueryClientProvider client={context.queryClient}>{children}</QueryClientProvider>,
	});

const router = createAppRouter({ platform: "web", queryClient: new QueryClient() });
const App = () => {
	return <RouterProvider context={{}} router={router} />;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
