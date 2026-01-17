import { Providers } from "@packages/ui/components/providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { AuthKitProvider } from "@workos-inc/authkit-react";
import type { RouterContext } from "./routes/__root";
import { routeTree } from "./routeTree.gen";
import "@packages/ui/index.css";

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createAppRouter>;
	}
}

export const createAppRouter = (context: RouterContext) => {
	const router = createRouter({
		routeTree,
		defaultErrorComponent: (e) => <div>Error: {e.error.message}</div>,
		defaultNotFoundComponent: (props) => <div>Not found {props.routeId}</div>,
		defaultPendingComponent: () => <div>Loading...</div>,
		context,
		Wrap: ({ children }) => (
			<AuthKitProvider clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}>
				<QueryClientProvider client={context.queryClient}>
					<Providers>{children}</Providers>
				</QueryClientProvider>
			</AuthKitProvider>
		),
	});

	return router;
};
