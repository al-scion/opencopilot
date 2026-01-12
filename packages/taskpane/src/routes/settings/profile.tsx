import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardContentItem } from "@/components/ui/card";

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
