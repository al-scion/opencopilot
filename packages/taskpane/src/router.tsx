import { ConvexProviderWithAuthKit } from "@convex-dev/workos";
import { Providers } from "@packages/ui/components/providers";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import type { RouterContext } from "./routes/__root";
import { routeTree } from "./routeTree.gen";

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
			<ConvexProviderWithAuthKit client={context.convexReactClient} useAuth={useAuth}>
				<QueryClientProvider client={context.queryClient}>
					<Providers>{children}</Providers>
				</QueryClientProvider>
			</ConvexProviderWithAuthKit>
		),
	});

	return router;
};
