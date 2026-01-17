import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<>
			<h1 className="font-medium text-lg">Profile</h1>
			<Card>
				<CardContent>
					<CardContentItem>Profile picture</CardContentItem>
					<CardContentItem>Email</CardContentItem>
					<CardContentItem>Name</CardContentItem>
				</CardContent>
			</Card>
		</>
	);
}
