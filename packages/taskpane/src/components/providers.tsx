import { ToastProvider } from "@packages/ui/components/ui/toast";
import { TooltipProvider } from "@packages/ui/components/ui/tooltip";
import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="light">
			<TooltipProvider delay={200}>
				<ToastProvider position="top-center">{children}</ToastProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};
