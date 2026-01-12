import { createFileRoute } from "@tanstack/react-router";
import { invoke } from "@tauri-apps/api/core";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<pre>{JSON.stringify(window.location, null, 2)}</pre>
		</div>
	);
}
