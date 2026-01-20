import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { useAuth } from "@workos-inc/authkit-react";
import type { ConvexReactClient } from "convex/react";
import "@packages/ui/index.css";
import { useAppState } from "@/lib/state";

export interface RouterContext {
	queryClient: QueryClient;
	convexReactClient: ConvexReactClient;
	convexQueryClient: ConvexQueryClient;
	auth: ReturnType<typeof useAuth>;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Outlet,
	beforeLoad: ({ context }) => {
		useAppState.setState({ auth: context.auth });
	},
	loader: async ({ context }) => {},
});
