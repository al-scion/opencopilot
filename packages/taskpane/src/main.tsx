import { RouterProvider } from "@tanstack/react-router";
import { AuthKitProvider, useAuth } from "@workos-inc/authkit-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { WORKOS_ACCESS_TOKEN_KEY } from "./lib/constants";
import { convexQueryClient, convexReactClient, queryClient } from "./lib/convex";
import { initWorkbook } from "./lib/excel/_init";
import { createAppRouter } from "./router";

export const router = createAppRouter({
	queryClient,
	convexReactClient,
	convexQueryClient,
	auth: undefined!,
});

console.log(Office.context);
if (
	Office.context?.platform === Office.PlatformType.Mac ||
	Office.context?.platform === Office.PlatformType.PC ||
	(Office.context?.platform === Office.PlatformType.OfficeOnline && !window.location.pathname.startsWith("/auth"))
) {
	await initWorkbook();
}

function App() {
	const auth = useAuth();
	if (auth.isLoading) {
		return null;
	}
	return <RouterProvider context={{ auth }} router={router} />;
}

type AuthKitProps = React.ComponentProps<typeof AuthKitProvider>;

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthKitProvider
			clientId={import.meta.env.VITE_WORKOS_CLIENT_ID}
			onRedirectCallback={(response) => sessionStorage.setItem(WORKOS_ACCESS_TOKEN_KEY, response.accessToken)}
			onRefresh={(response) => sessionStorage.setItem(WORKOS_ACCESS_TOKEN_KEY, response.accessToken)}
			onRefreshFailure={() => sessionStorage.removeItem(WORKOS_ACCESS_TOKEN_KEY)}
			redirectUri={`${window.location.origin}/auth/callback`}
		>
			<App />
		</AuthKitProvider>
	</StrictMode>
);
