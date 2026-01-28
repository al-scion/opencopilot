import {
	Command,
	CommandDialog,
	CommandDialogContent,
	CommandEmpty,
	type CommandGroupData,
	CommandInput,
	CommandListTemplate,
} from "@packages/ui/components/ui/command";
import { browserShortcuts, getShortcutParts, getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";

export function ShortcutMenu() {
	const { shortcutMenuOpen } = useAppState();
	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ shortcutMenuOpen: open });
	};

	useShortcut({ name: "shortcutMenu", action: () => handleOpenChange(!shortcutMenuOpen) });

	const shortcutItems: CommandGroupData[] = [
		{
			items: browserShortcuts.map((shortcut) => ({
				value: shortcut.name,
				label: shortcut.label,
				shortcut: (
					<div className="flex flex-row items-center gap-1">
						{getShortcutParts(shortcut.name).map((key) => (
							<kbd
								className="inline-flex h-5 min-w-5 cursor-default select-none items-center justify-center rounded-xs border border-foreground/15 px-[3px] py-0 text-center font-medium font-sans text-sm text-xs leading-tight tracking-normal"
								key={key}
							>
								{key}
							</kbd>
						))}
					</div>
				),
			})),
		},
	];

	return (
		<CommandDialog onOpenChange={handleOpenChange} open={shortcutMenuOpen}>
			<CommandDialogContent>
				<Command items={shortcutItems}>
					<CommandInput placeholder={"Search shortcuts"} />
					<CommandEmpty>No shortcuts found</CommandEmpty>
					<CommandListTemplate
						itemClassName="data-highlighted:bg-background cursor-auto"
						itemShortcutClassName={"tracking-widest"}
					/>
				</Command>
			</CommandDialogContent>
		</CommandDialog>
	);
}
