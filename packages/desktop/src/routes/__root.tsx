import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet } from "@tanstack/react-router";
// import { Providers } from "@/components/providers";
// import { useAppState } from "@/lib/state";
import "../index.css";

export interface RouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootComponent,
	head: (ctx) => ({
		links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
	}),
	beforeLoad: async ({ context }) => {
		// const operatingSystem = navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows";
		// useAppState.setState({ operatingSystem, auth: context.auth });
	},
	loader: async ({ context }) => {},
});

function RootComponent() {
	return (
		<>
			<HeadContent />
			{/* <Providers> */}
			<Outlet />
			{/* </Providers> */}
		</>
	);
}
