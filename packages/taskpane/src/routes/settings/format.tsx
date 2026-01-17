import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/format")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="font-medium text-lg">Number formats</h1>
			<Card>
				<CardContent>
					<CardContentItem>Date format</CardContentItem>
				</CardContent>
			</Card>
		</>
	);
}
