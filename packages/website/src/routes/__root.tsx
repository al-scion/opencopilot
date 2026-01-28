import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import appCss from "@/index.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Website",
			},
		],
		links: [
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
			{ rel: "stylesheet", href: appCss },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		],
	}),
	component: RootComponent,
});

function RootComponent() {
	return (
		<html className="overscroll-none" lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="relative">
				<Scripts />
				<RootProvider search={{ options: { type: "fetch" } }}>
					<div className="isolate flex min-h-svh w-screen flex-col overflow-x-clip">
						<Outlet />
					</div>
				</RootProvider>
			</body>
		</html>
	);
}
