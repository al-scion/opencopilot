import { createFileRoute, useRouteContext } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { platform } = Route.useRouteContext();
	return (
		<div>
			Hello "/" welcome to the {platform} app! {JSON.stringify(import.meta.env)}
		</div>
	);
}
