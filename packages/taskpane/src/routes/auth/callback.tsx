import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoadingPage } from "@/components/loading-page";

export const Route = createFileRoute("/auth/callback")({
	component: LoadingPage,
	beforeLoad: async (props) => {
		await Office.onReady(({ host, platform }) => {
			if (platform === Office.PlatformType.Mac || platform === Office.PlatformType.PC) {
				throw redirect({ to: "/taskpane" });
			}
		});

		const refreshToken = localStorage.getItem("workos:refresh-token")!;
		Office.context.ui.messageParent(refreshToken, { targetOrigin: window.location.origin });
	},
});
