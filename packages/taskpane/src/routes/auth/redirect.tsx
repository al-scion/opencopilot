import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/redirect")({
	component: Outlet,
	beforeLoad: async (props) => {
		await props.context.auth.signIn();
	},
});
