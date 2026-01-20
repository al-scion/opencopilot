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
import { Check, ChevronDown } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAgentConfig, useAppState } from "@/lib/state";

export function ModeSelector() {
	const { mode } = useAgentConfig();
	const selectedMode = MODES.find((option) => option.id === mode)!;
	const writeEnabled = Office.context.document.mode === Office.DocumentMode.ReadWrite;

	// Filter out write required modes if the document is read only
	const availableModes = MODES.filter((option) => (option.writeRequired && writeEnabled) || !option.writeRequired);

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
						className={cn(state.open && "bg-muted")}
						shortcutKeys={getShortcutString("toggleMode")}
						size="sm"
						tooltip="Toggle mode"
						tooltipAlign="start"
						tooltipDisabled={state.open}
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<span className="font-normal text-sm">{selectedMode.name} mode</span>
				<ChevronDown className="-mx-0.5 size-3 text-foreground" />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" className="w-36 min-w-fit">
				<DropdownMenuGroup>
					{availableModes.map((option) => (
						<DropdownMenuItem
							className="font-normal text-sm"
							key={option.id}
							onClick={() => handleSelectMode(option.id)}
						>
							<span>{option.name}</span>
							<DropdownMenuShortcut>{mode === option.id && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
