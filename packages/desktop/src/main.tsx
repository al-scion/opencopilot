import { createAppRouter } from "@packages/app";
import { QueryClient } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const queryClient = new QueryClient();
const router = createAppRouter({ platform: "desktop", queryClient });

const App = () => {
	return <RouterProvider context={{}} router={router} />;
};

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>
);
