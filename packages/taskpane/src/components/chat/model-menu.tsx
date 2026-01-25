import { languageModelOptions, providerRegistry } from "@packages/shared";
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
	const selectedModel = languageModelOptions.find((option) => option.id === model)!;
	const selectedProvider = providerRegistry[selectedModel.provider];

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
						maskImage: `url(${selectedProvider.iconUrl})`,
						maskSize: "contain",
						maskRepeat: "no-repeat",
						maskPosition: "center",
						WebkitMaskImage: `url(${selectedProvider.iconUrl})`,
						WebkitMaskSize: "contain",
						WebkitMaskRepeat: "no-repeat",
						WebkitMaskPosition: "center",
					}}
				/>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-48 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select model</DropdownMenuLabel>
					{languageModelOptions.map((option) => (
						<DropdownMenuItem key={option.id} onClick={() => useAgentConfig.setState({ model: option.id })}>
							<img alt={option.name} height={16} src={providerRegistry[option.provider].iconUrl} width={16} />
							<span>{option.name}</span>
							<DropdownMenuShortcut>{selectedModel.id === option.id && <Check />}</DropdownMenuShortcut>
						</DropdownMenuItem>
					))}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
