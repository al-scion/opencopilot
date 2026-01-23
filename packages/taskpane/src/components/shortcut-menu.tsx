import {
	Command,
	CommandCollection,
	CommandDialog,
	CommandDialogContent,
	CommandGroup,
	type CommandGroupData,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	type CommandItemData,
	CommandList,
	CommandShortcut,
} from "@packages/ui/components/ui/command";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";

export function ShortcutMenu() {
	const { shortcutMenuOpen } = useAppState();
	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ shortcutMenuOpen: open });
	};

	useShortcut({ name: "shortcutMenu", action: () => handleOpenChange(!shortcutMenuOpen) });

	return (
		<CommandDialog onOpenChange={handleOpenChange} open={shortcutMenuOpen}>
			<CommandDialogContent>
				<Command>
					<CommandInput placeholder={"Search shortcuts"} />
					<CommandList>
						{(group: CommandGroupData, index) => (
							<CommandGroup items={group.items} key={index}>
								{group.label && <CommandGroupLabel>{group.label}</CommandGroupLabel>}
								<CommandCollection>
									{(item: CommandItemData) => (
										<CommandItem key={item.value} onClick={item.onClick} value={item.value}>
											{item.icon}
											<span className="truncate">{item.label}</span>
											{item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
										</CommandItem>
									)}
								</CommandCollection>
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</CommandDialogContent>
		</CommandDialog>
	);
}
