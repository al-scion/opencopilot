import { MODES, type ModeId } from "@packages/shared";
import {
	Check,
	ChevronDown,
	InfinityIcon,
	MessageCircleIcon,
	MessageCircleMoreIcon,
	MousePointer2Icon,
	Paintbrush2Icon,
	PenSquareIcon,
} from "lucide-react";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { TooltipButton } from "../tooltip-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const ModeIcon = ({ modeId, ...props }: { modeId: ModeId } & React.SVGProps<SVGSVGElement>) => {
	const Icon = {
		agent: PenSquareIcon,
		format: Paintbrush2Icon,
		ask: MessageCircleMoreIcon,
	}[modeId];
	return <Icon {...props} />;
};

export function ModeSelector() {
	const { agentConfig, workbookConfig, setAgentConfig } = useAppState();
	const selectedMode = MODES.find((mode) => mode.id === agentConfig.mode)!;

	// Filter out write required modes if the document is read only
	const availableModes = MODES.filter(
		(mode) => (mode.writeRequired && workbookConfig.documentMode === "readWrite") || !mode.writeRequired
	);

	const toggleMode = () => {
		const currentIndex = availableModes.findIndex((mode) => mode.id === agentConfig.mode);
		const nextIndex = (currentIndex + 1) % availableModes.length;
		setAgentConfig({ mode: availableModes[nextIndex]!.id });
	};

	useShortcut({ name: "toggleMode", action: toggleMode });

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn(state.open && "bg-muted")}
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
				<ModeIcon className="size-4" modeId={selectedMode.id} />
				{/* <span className="font-normal text-sm">{selectedMode.name} mode</span> */}
				{/* <ChevronDown className="-mx-0.5 size-3 text-foreground" /> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-40 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select mode</DropdownMenuLabel>
					{availableModes.map((mode) => (
						<DropdownMenuItem
							className="font-normal text-sm"
							key={mode.id}
							onClick={() => setAgentConfig({ mode: mode.id })}
						>
							<ModeIcon className="size-4" modeId={mode.id} />
							<span>{mode.name}</span>
							<DropdownMenuShortcut>{agentConfig.mode === mode.id && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
