import { Providers } from "@packages/ui/components/providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
// import { Providers } from "@/components/providers";
import type { RouterContext } from "./routes/__root";
import { routeTree } from "./routeTree.gen";
import "@packages/ui/index.css";

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
		Wrap: ({ children }) => (
			<QueryClientProvider client={context.queryClient}>
				<Providers>{children}</Providers>
			</QueryClientProvider>
		),
	});
