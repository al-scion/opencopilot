import type { ConvexQueryClient } from "@convex-dev/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { useAuth } from "@workos-inc/authkit-react";
import type { ConvexReactClient } from "convex/react";
import { Providers } from "@/components/providers";
import { useAppState } from "@/lib/state";
import "../index.css";

export interface RouterContext {
	queryClient: QueryClient;
	convexReactClient: ConvexReactClient;
	convexQueryClient: ConvexQueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	beforeLoad: async ({ context }) => {
		console.log(navigator.userAgent);
		const operatingSystem = navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows";
		useAppState.setState({ operatingSystem });
	},
	loader: async ({ context }) => {},
});

function RootComponent() {
	return (
		<Providers>
			<Outlet />
		</Providers>
	);
}
