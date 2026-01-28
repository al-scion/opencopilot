import { cn } from "@packages/ui/lib/utils";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ShortcutMenu } from "@/components/shortcut-menu";

export const Route = createFileRoute("/taskpane")({
	component: RouteComponent,
});

function RouteComponent() {
	const backgroundColor = Office?.context?.officeTheme?.bodyBackgroundColor ?? "#f5f5f5";
	const isWindows = Office.context.platform === Office.PlatformType.PC;

	return (
		<div
			className={cn("flex h-dvh w-full flex-col p-1.5", isWindows && "p-0")}
			style={{ backgroundColor: isWindows ? undefined : backgroundColor }}
		>
			<div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl bg-background">
				<Outlet />
				<ShortcutMenu />
			</div>
		</div>
	);
}
