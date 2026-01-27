import { permissionsConfig } from "@packages/shared";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@packages/ui/components/ui/dropdown-menu";
import { cn } from "@packages/ui/lib/utils";
import { Check, CircleCheckBigIcon, FastForwardIcon, type LucideIcon, MessageCircleMoreIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAgentConfig, useAppState } from "@/lib/state";

const iconMap: Record<keyof typeof permissionsConfig, LucideIcon> = {
	edit: FastForwardIcon,
	ask: CircleCheckBigIcon,
	read: MessageCircleMoreIcon,
};

export function PermissionMenu() {
	const { editor, permissionMenuOpen } = useAppState();
	const { permission } = useAgentConfig();
	const availablePermissions = Object.keys(permissionsConfig) as (keyof typeof permissionsConfig)[];
	const selectedPermission = permissionsConfig[permission];
	const SelectedIcon = iconMap[permission];

	const isReadOnly = Office.context.document.mode === Office.DocumentMode.ReadOnly;
	const cyclePermission = (e: KeyboardEvent) => {
		e.stopPropagation();
		if (isReadOnly) {
			return;
		}
		const currentIndex = availablePermissions.indexOf(permission);
		const nextIndex = (currentIndex + 1) % availablePermissions.length;
		const nextPermission = availablePermissions[nextIndex]!;
		useAgentConfig.setState({ permission: nextPermission });
		editor.commands.focus();
	};

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ permissionMenuOpen: open });
		!open && editor.commands.focus();
	};

	useShortcut({ name: "togglePermission", action: cyclePermission });

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={permissionMenuOpen}>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn(state.open && "bg-muted")}
						shortcutKeys={getShortcutString("togglePermission")}
						size="icon"
						// tooltip={selectedPermission.label}
						tooltip={"Set permission"}
						tooltipDisabled={state.open}
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<SelectedIcon />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-48 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Set permission</DropdownMenuLabel>
					{availablePermissions.map((key) => {
						const PermissionIcon = iconMap[key];
						const config = permissionsConfig[key];
						const isDisabled = isReadOnly && config.writeRequired;
						return (
							<DropdownMenuItem
								className="font-normal text-sm"
								disabled={isDisabled}
								key={key}
								onClick={() => useAgentConfig.setState({ permission: key })}
							>
								<PermissionIcon />
								<span>{config.label}</span>
								<DropdownMenuShortcut>{permission === key && <Check />}</DropdownMenuShortcut>
							</DropdownMenuItem>
						);
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
