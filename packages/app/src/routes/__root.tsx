import type { OpencodeClient } from "@opencode-ai/sdk/v2/client";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export type RouterContext = {
	platform: "web" | "desktop";
	queryClient: QueryClient;
	opencode: OpencodeClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Outlet,
	beforeLoad: async ({ context }) => {},
	loader: async ({ context }) => {},
});
