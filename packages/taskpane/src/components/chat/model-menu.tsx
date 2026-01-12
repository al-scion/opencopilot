import { LANGUAGE_MODELS, type LanguageModelId } from "@packages/shared";
import { Check } from "lucide-react";
// import type { ModelId } from "@/lib/agent/config";
// import { MODELS } from "@/lib/agent/config";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";
import { TooltipButton } from "../tooltip-button";
// import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "../ui/command";
// import { Dialog, DialogDescription, DialogHeader, DialogPopup, DialogTitle } from "../ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ModelMenu() {
	const { editor, modelMenuOpen } = useAppState();
	const { agentConfig, setAgentConfig } = useAppState();
	const setModel = (modelId: LanguageModelId) => setAgentConfig({ model: modelId });
	const selectedModel = LANGUAGE_MODELS.find((model) => model.id === agentConfig.model)!;

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
						className={cn(state.open && "bg-muted")}
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
				{/* <span className="font-light text-sm">{selectedModelData.name}</span> */}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-48 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select model</DropdownMenuLabel>
					{LANGUAGE_MODELS.map((model) => (
						<DropdownMenuItem key={model.id} onClick={() => setModel(model.id)}>
							<img alt={model.name} height={16} src={model.icon} width={16} />
							<span>{model.name}</span>
							<DropdownMenuShortcut>{model.id === agentConfig.model && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
