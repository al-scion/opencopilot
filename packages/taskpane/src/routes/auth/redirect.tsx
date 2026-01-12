import { createFileRoute } from "@tanstack/react-router";
import { LoadingPage } from "@/components/loading-page";

export const Route = createFileRoute("/auth/redirect")({
	component: LoadingPage,
	beforeLoad: async (props) => {
		await props.context.auth.signIn();
	},
});
