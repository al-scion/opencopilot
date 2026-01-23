import { LANGUAGE_MODELS, type LanguageModelId } from "@packages/shared";
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
import { Check } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAgentConfig, useAppState } from "@/lib/state";

export function ModelMenu() {
	const { editor, modelMenuOpen } = useAppState();
	const { model } = useAgentConfig();
	const handleSetModel = (modelId: LanguageModelId) => useAgentConfig.setState({ model: modelId });
	const selectedModel = LANGUAGE_MODELS.find((m) => m.id === model)!;

	useShortcut({ name: "toggleModel", action: () => handleOpenChange(!modelMenuOpen) });

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ modelMenuOpen: open });
		!open && editor.commands.focus();
	};

	return (
		<DropdownMenu onOpenChange={handleOpenChange} open={modelMenuOpen}>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn("rounded-full", state.open && "bg-muted")}
						shortcutKeys={getShortcutString("toggleModel")}
						size="icon"
						tooltip={selectedModel.name}
						tooltipDisabled={state.open}
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<div
					aria-label={selectedModel.name}
					className="h-4 w-4 bg-muted-foreground"
					role="img"
					style={{
						maskImage: `url(${selectedModel.icon})`,
						maskSize: "contain",
						maskRepeat: "no-repeat",
						maskPosition: "center",
						WebkitMaskImage: `url(${selectedModel.icon})`,
						WebkitMaskSize: "contain",
						WebkitMaskRepeat: "no-repeat",
						WebkitMaskPosition: "center",
					}}
				/>
				{/* <span className="font-light text-muted-foreground text-sm">{selectedModel.name}</span> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-48 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select model</DropdownMenuLabel>
					{LANGUAGE_MODELS.map((option) => (
						<DropdownMenuItem key={option.id} onClick={() => handleSetModel(option.id)}>
							<img alt={option.name} height={16} src={option.icon} width={16} />
							<span>{option.name}</span>
							<DropdownMenuShortcut>{option.id === model && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
