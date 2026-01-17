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
import { useAppState } from "@/lib/state";

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
