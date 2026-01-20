import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/callback")({
	component: Outlet,
	beforeLoad: async (props) => {
		console.log(Office.context);
		await Office.onReady(({ host, platform }) => {
			if (platform === Office.PlatformType.Mac || platform === Office.PlatformType.PC) {
				throw redirect({ to: "/taskpane" });
			}
		});

		const refreshToken = localStorage.getItem("workos:refresh-token")!;
		Office.context.ui.messageParent(refreshToken, { targetOrigin: window.location.origin });
		window.close();
	},
});
