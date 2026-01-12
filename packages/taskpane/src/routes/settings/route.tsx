import { createFileRoute, HeadContent, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import {
	BoxIcon,
	CircleUserRound,
	Keyboard,
	Palette,
	SlidersHorizontal,
	SquareSigma,
	SquareSigmaIcon,
	Unplug,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	useSidebar,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/settings")({
	component: RouteComponent,
});

const sidebarItems = [
	{
		label: "Preferences",
		icon: SlidersHorizontal,
		url: "/settings",
	},
	{
		label: "Profile",
		icon: CircleUserRound,
		url: "/settings/profile",
	},
	{
		label: "Shortcuts",
		icon: Keyboard,
		url: "/settings/shortcuts",
	},
	{
		label: "Integrations",
		icon: Unplug,
		url: "/settings/integrations",
	},
	{
		label: "Models",
		icon: BoxIcon,
		url: "/settings/models",
	},
];

const formattingItems = [
	{
		label: "Number formats",
		icon: SquareSigma,
		url: "/settings/format",
	},
	{
		label: "Colour & styles",
		icon: Palette,
		url: "/settings/styles",
	},
];

function RouteComponent() {
	const router = useRouter();
	const location = useLocation();

	return (
		<SidebarProvider className="border-t" open={true} style={{ "--sidebar-width": "12rem" } as React.CSSProperties}>
			<Sidebar className="h-[calc(100vh-1px)] border-r" collapsible="none">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupLabel>Settings</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{sidebarItems.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton
											isActive={location.pathname === item.url}
											onClick={() => router.navigate({ to: item.url })}
										>
											<item.icon />
											{item.label}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
					<SidebarGroup>
						<SidebarGroupLabel>Formatting</SidebarGroupLabel>
						<SidebarGroupContent>
							<SidebarMenu>
								{formattingItems.map((item) => (
									<SidebarMenuItem key={item.label}>
										<SidebarMenuButton
											isActive={location.pathname === item.url}
											onClick={() => router.navigate({ to: item.url })}
										>
											<item.icon />
											{item.label}
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
				{/* <SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton onClick={() => window.close()}>
								Close
								<span className="ml-auto font-light text-muted-foreground text-xs">Esc</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter> */}
			</Sidebar>
			<div className="mx-auto flex max-w-[560px] flex-1 flex-col gap-4 p-4">
				<Outlet />
			</div>
		</SidebarProvider>
	);
}
