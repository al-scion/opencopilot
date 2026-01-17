import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@packages/ui/components/ui/sidebar";
import { PanelLeftIcon, PlusIcon, SettingsIcon } from "lucide-react";

export const AppSidebar = () => {
	return (
		<Sidebar collapsible="icon">
			<SidebarContent>
				<SidebarGroup>
					{/* <SidebarGroupLabel>Settings</SidebarGroupLabel> */}
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton className="border" variant="outline">
									<PlusIcon />
									New workspace
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton tooltip="Settings">
							<SettingsIcon />
							Settings
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton>
							<PanelLeftIcon />
							Collapse sidebar
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
