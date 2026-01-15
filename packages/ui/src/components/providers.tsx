import { ThemeProvider } from "next-themes";
import { SidebarProvider } from "./ui/sidebar";
import { ToastProvider } from "./ui/toast";
import { TooltipProvider } from "./ui/tooltip";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="light">
			<TooltipProvider delay={200}>
				<ToastProvider position="top-center">
					<SidebarProvider style={{ "--sidebar-width": "14rem" } as React.CSSProperties}>{children}</SidebarProvider>
				</ToastProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};
