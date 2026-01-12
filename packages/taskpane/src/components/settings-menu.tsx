import { useRouter } from "@tanstack/react-router";
import { CircleUserRound, Keyboard, LogOut, Settings } from "lucide-react";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { TooltipButton } from "./tooltip-button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function SettingsMenu() {
	const router = useRouter();
	const { editor, settingsMenuOpen } = useAppState();

	const handleOpenSettings = () => {
		Office.context.ui.displayDialogAsync(
			router.buildLocation({ to: "/settings" }).url.href,
			{
				displayInIframe: true,
				promptBeforeOpen: false,
				height: 60,
				width: 60,
			},
			(result) => {
				result.value.addEventHandler(Office.EventType.DialogMessageReceived, (event) => {
					if ("error" in event) {
						return;
					}
					const message = event.message;
				});
			}
		);
	};

	const handleSignOut = () => {
		// signOut({ navigate: false });
		window.location.href = `${window.location.origin}/taskpane/sign-in`;
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
						className={cn("hover:bg-background", state.open && "bg-muted")}
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
				<Settings />
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
					<DropdownMenuItem>
						<Keyboard />
						Shortcuts
					</DropdownMenuItem>
					{/* <DropdownMenuSeparator /> */}
					<DropdownMenuItem onClick={handleSignOut}>
						<LogOut />
						Sign out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
