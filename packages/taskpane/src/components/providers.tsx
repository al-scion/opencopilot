import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "./ui/toast";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<ThemeProvider attribute="class" defaultTheme="light" disableTransitionOnChange enableSystem>
			<TooltipProvider delay={200}>
				<ToastProvider position="top-center">{children}</ToastProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};
