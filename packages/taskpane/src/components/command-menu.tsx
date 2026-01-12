import { ArrowUpDown } from "lucide-react";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useAppState } from "@/lib/state";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from "./ui/command";
import { Dialog, DialogDescription, DialogHeader, DialogPopup, DialogTitle } from "./ui/dialog";
import { Kbd } from "./ui/kbd";

export function CommandMenu() {
	const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);
	// const { commandMenuOpen } = useAppState();
	// const setCommandMenuOpen = (open: boolean) => useAppState.setState({ commandMenuOpen: open });

	useHotkeys("meta+k", () => setCommandMenuOpen(!commandMenuOpen), {
		enableOnContentEditable: true,
		enableOnFormTags: true,
	});

	return (
		<Dialog onOpenChange={setCommandMenuOpen} open={commandMenuOpen}>
			<DialogHeader className="sr-only">
				<DialogTitle>Search documentation...</DialogTitle>
				<DialogDescription>Search for a command to run...</DialogDescription>
			</DialogHeader>
			<DialogPopup className="min-h-100 p-3" showCloseButton={false}>
				<Command
					filter={(value, search, keywords) =>
						keywords?.some((keyword) => keyword.toLowerCase().includes(search.toLowerCase())) ? 1 : 0
					}
					loop
				>
					<CommandInput placeholder="Search" wrapperClassName="border-none bg-muted rounded-lg" />
					<CommandList className="no-scrollbar min-h-80 overflow-auto pt-1 pb-7">
						<CommandEmpty>No items found</CommandEmpty>
						<CommandGroup className="px-0" />
					</CommandList>
				</Command>
				<div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 rounded-b-xl border-t bg-muted px-3 py-2 text-foreground text-xs">
					<div className="flex items-center gap-1.5">
						<Kbd className="border bg-background p-0.5 text-foreground shadow-xs">
							<ArrowUpDown strokeWidth={2.1} />
						</Kbd>
						Navigate
					</div>
					<div className="flex items-center gap-1.5">
						<Kbd className="border bg-background p-0.5 font-normal text-foreground shadow-xs">⏎</Kbd>
						Select
					</div>
				</div>
			</DialogPopup>
		</Dialog>
	);
}
