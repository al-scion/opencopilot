import { cn } from "@packages/ui/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { initWorkbook } from "@/lib/excel/_init";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/taskpane")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		await initWorkbook();
	},
});

function RouteComponent() {
	const officePlatform = useAppState().workbookConfig.officePlatform;

	return (
		<div
			className={cn(
				"flex h-dvh w-full flex-col p-1.5",
				officePlatform === "mac" && "bg-taskpane-background-mac",
				officePlatform === "web" && "bg-taskpane-background-web",
				officePlatform === "windows" && "bg-taskpane-background-windows"
			)}
		>
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl bg-background">
				<Outlet />
			</div>
		</div>
	);
}
