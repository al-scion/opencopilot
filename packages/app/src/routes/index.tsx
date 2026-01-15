import { AppSidebar } from "@packages/ui/components/app-sidebar";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: async ({ context }) => {
		const config = await context.opencode.config.get();
		const health = await context.opencode.global.health();
		console.log(config.data, health);
	},
});

function RouteComponent() {
	const { platform, opencode } = Route.useRouteContext();
	return (
		<div className="flex">
			<AppSidebar />
			<span>
				Hello "/" welcome to the {platform} app! {JSON.stringify(import.meta.env)}
			</span>
		</div>
	);
}
