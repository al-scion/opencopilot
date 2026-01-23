import {
	Command,
	CommandCollection,
	CommandEmpty,
	CommandGroup,
	type CommandGroupData,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	type CommandItemData,
	CommandList,
	CommandShortcut,
} from "@packages/ui/components/ui/command";
import { cn } from "@packages/ui/lib/utils";
import { PluginKey } from "@tiptap/pm/state";
import type { Editor, Range } from "@tiptap/react";
import { useEditorState } from "@tiptap/react";
import type { SuggestionProps } from "@tiptap/suggestion";
import { useAppState } from "@/lib/state";

type MentionPluginState = {
	query: SuggestionProps["query"];
	range: SuggestionProps["range"];
	text: SuggestionProps["text"];
	active: boolean;
	composing: boolean;
	decorationId: string | null;
};

export const MentionPluginKey = new PluginKey<MentionPluginState>("mention");

const insertMention = ({ id, label, editor, range }: { id: string; label: string; editor: Editor; range: Range }) => {
	editor
		.chain()
		.insertContentAt(range, [
			{ type: "mention", attrs: { id, label } },
			{ type: "text", text: " " },
		])
		.focus()
		.run();
};

export function CommandMenu({
	mentionState,
	inputRef,
	editor,
}: {
	mentionState: MentionPluginState | undefined;
	inputRef: React.Ref<HTMLInputElement>;
	editor: Editor;
}) {
	const { selectedRange, worksheets } = useAppState();

	const selectedRangeOption: CommandItemData = {
		value: selectedRange.address,
		label: selectedRange.address,
		shortcut: "Selection",
		onClick: () =>
			insertMention({ id: selectedRange.address, label: selectedRange.address, editor, range: mentionState!.range! }),
	};

	const worksheetItems: CommandItemData[] = worksheets.map((worksheet) => ({
		value: worksheet.name,
		label: worksheet.name,
		shortcut: "Worksheet",
		onClick: () => insertMention({ id: worksheet.name, label: worksheet.name, editor, range: mentionState!.range! }),
	}));

	const commandGroupData: CommandGroupData[] = [
		{
			// label: "Workbook",
			items: [selectedRangeOption, ...worksheetItems],
		},
	];

	return (
		<Command
			className={cn(
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 rounded-lg border p-1",
				"origin-bottom transition-all duration-50 ease-in-out",
				mentionState?.query == null ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
			)}
			items={commandGroupData}
			itemToStringValue={(item) => (item as CommandItemData).label}
			value={mentionState?.query}
		>
			<CommandInput ref={inputRef} wrapperClassName="hidden" />
			<CommandEmpty>No results</CommandEmpty>
			<CommandList>
				{(group: CommandGroupData, index) => (
					<CommandGroup className="p-0" items={group.items} key={index}>
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
	);
}
