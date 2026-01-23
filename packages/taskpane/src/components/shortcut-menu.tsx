import {
	Command,
	CommandDialog,
	CommandDialogContent,
	type CommandGroupData,
	CommandInput,
	CommandListTemplate,
} from "@packages/ui/components/ui/command";
import { browserShortcuts, getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
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
				shortcut: getShortcutString(shortcut.name),
			})),
		},
	];

	return (
		<CommandDialog onOpenChange={handleOpenChange} open={shortcutMenuOpen}>
			<CommandDialogContent>
				<Command items={shortcutItems}>
					<CommandInput placeholder={"Search shortcuts"} />
					<CommandListTemplate
						itemClassName="data-highlighted:bg-background cursor-auto"
						itemShortcutClassName={"tracking-widest"}
					/>
				</Command>
			</CommandDialogContent>
		</CommandDialog>
	);
}
