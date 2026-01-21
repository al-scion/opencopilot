import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@packages/ui/components/ui/dropdown-menu";
import { cn } from "@packages/ui/lib/utils";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { CircleUserRoundIcon, Ellipsis, Keyboard, LogOut, Settings } from "lucide-react";
import { signInWithDialog } from "@/lib/auth";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";
import { TooltipButton } from "./tooltip-button";

export function SettingsMenu() {
	const { signOut, signIn, user } = useAuth();
	const router = useRouter();
	const { editor, settingsMenuOpen } = useAppState();

	const handleOpenSettings = () => {
		router.navigate({ to: "/taskpane/settings" });
	};

	const handleAuth = async () => {
		if (user) {
			signOut({ navigate: false });
			window.location.href = `${window.location.origin}/taskpane`;
		} else {
			const isOfficeOnline = Office.context.platform === Office.PlatformType.OfficeOnline;
			if (isOfficeOnline) {
				signInWithDialog();
			} else {
				signIn({});
			}
		}
	};

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ settingsMenuOpen: open });
		!open && editor.commands.focus();
	};
	useShortcut({ name: "openSettings", action: () => handleOpenChange(!settingsMenuOpen) });

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={settingsMenuOpen}>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn(state.open && "bg-muted")}
						shortcutKeys={getShortcutString("openSettings")}
						size="icon"
						tooltip="Settings"
						tooltipDisabled={state.open}
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<Ellipsis />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className={"w-fit"}>
				{/* <DropdownMenuGroup className="flex flex-row items-center gap-2 px-1 py-0">
					<Avatar className="size-6">
						<AvatarImage src={user?.profilePictureUrl ?? ""} />
						<AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
					</Avatar>
					<div className="flex flex-col">
						<span className="truncate text-sm">
							{user?.firstName} {user?.lastName}
						</span>
						<span className="font-light text-muted-foreground text-xs">{user?.email}</span>
					</div>
				</DropdownMenuGroup>
				<DropdownMenuSeparator /> */}
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={handleOpenSettings}>
						<Settings />
						Settings
					</DropdownMenuItem>
					{/* <DropdownMenuItem>
						<Keyboard />
						Shortcuts
					</DropdownMenuItem> */}
					{/* <DropdownMenuSeparator /> */}
					<DropdownMenuItem onClick={handleAuth}>
						{user ? <LogOut /> : <CircleUserRoundIcon />}
						{user ? "Sign out" : "Sign in"}
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
