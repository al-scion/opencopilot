import { MODES, type ModeId } from "@packages/shared";
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
import { Check, ChevronDown, FastForwardIcon, type LucideIcon, MessageCircleMoreIcon, PaletteIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAgentConfig, useAppState } from "@/lib/state";

const iconMap: Record<ModeId, LucideIcon> = {
	agent: FastForwardIcon,
	ask: MessageCircleMoreIcon,
	format: PaletteIcon,
};

export function ModeSelector() {
	const { mode } = useAgentConfig();
	const MODES_WITH_ICON = MODES.map((mode) => ({ ...mode, icon: iconMap[mode.id] }));
	const selectedMode = MODES_WITH_ICON.find((option) => option.id === mode)!;

	// Filter out write required modes if the document is read only
	const writeEnabled = Office.context.document.mode === Office.DocumentMode.ReadWrite;
	const availableModes = MODES_WITH_ICON.filter(
		(option) => (option.writeRequired && writeEnabled) || !option.writeRequired
	);

	const toggleMode = (e: KeyboardEvent) => {
		e.stopPropagation();
		const currentIndex = availableModes.findIndex((option) => option.id === mode);
		const nextIndex = (currentIndex + 1) % availableModes.length;
		useAgentConfig.setState({ mode: availableModes[nextIndex]!.id });
	};

	const handleSelectMode = (modeId: ModeId) => {
		useAgentConfig.setState({ mode: modeId });
	};

	useShortcut({ name: "toggleMode", action: toggleMode });

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn("rounded-full", state.open && "bg-muted")}
						shortcutKeys={getShortcutString("toggleMode")}
						size="icon"
						tooltip="Toggle mode"
						tooltipDisabled={state.open}
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<selectedMode.icon />
				{/* <span className="font-light text-muted-foreground text-xs">{selectedMode.description}</span> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-48 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Set permission</DropdownMenuLabel>
					{availableModes.map((option) => (
						<DropdownMenuItem
							className="font-normal text-sm"
							key={option.id}
							onClick={() => handleSelectMode(option.id)}
						>
							<option.icon />
							<span>{option.description}</span>
							<DropdownMenuShortcut>{mode === option.id && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
