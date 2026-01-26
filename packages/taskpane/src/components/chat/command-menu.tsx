import {
	Command,
	CommandEmpty,
	type CommandGroupData,
	CommandInput,
	CommandListTemplate,
} from "@packages/ui/components/ui/command";
import { cn } from "@packages/ui/lib/utils";
import { PluginKey } from "@tiptap/pm/state";
import type { Editor, Range } from "@tiptap/react";
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

export function CommandMenu({
	mentionState,
	inputRef,
	editor,
}: {
	mentionState: MentionPluginState | undefined;
	inputRef: React.Ref<HTMLInputElement>;
	editor: Editor;
}) {
	const { charts, worksheets, activeSelection } = useAppState();
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

	const commandGroupData: CommandGroupData[] = [
		{
			// label: "Workbook",
			items: [
				...charts.map((chart) => ({
					value: chart.id,
					label: chart.name,
					shortcut: "Chart",
					onClick: () => insertMention({ id: chart.id, label: chart.name, editor, range: mentionState!.range! }),
				})),
				...worksheets.map((worksheet) => ({
					value: worksheet.name,
					label: worksheet.name,
					shortcut: "Worksheet",
					onClick: () =>
						insertMention({ id: worksheet.name, label: worksheet.name, editor, range: mentionState!.range! }),
				})),
			],
		},
	];

	return (
		<Command
			className={cn(
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 rounded-lg border p-1",
				mentionState?.active ? "block" : "hidden"
				// "origin-bottom transition-all duration-50 ease-in-out",
				// mentionState?.query == null ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
			)}
			items={commandGroupData}
			value={mentionState?.query}
		>
			<CommandInput ref={inputRef} wrapperClassName="hidden" />
			<CommandEmpty>No results</CommandEmpty>
			<CommandListTemplate groupClassName="p-0" />
		</Command>
	);
}
