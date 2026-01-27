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
import { getShortcutString } from "@/lib/browser-shortcuts";
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
export const CommandPluginKey = new PluginKey<MentionPluginState>("command");

export function CommandMenu({
	state,
	inputRef,
	editor,
}: {
	state: MentionPluginState | undefined;
	inputRef: React.Ref<HTMLInputElement>;
	editor: Editor;
}) {
	const { permissionMenuOpen } = useAppState();

	const closeMenu = () => editor.chain().deleteRange(state!.range).run();

	const commandGroupData: CommandGroupData[] = [
		{
			items: [
				{
					label: "Upload file",
					value: "uploadFile",
					onClick: () => {},
					shortcut: getShortcutString("uploadFile"),
				},
			],
		},
		{
			label: "Customize",
			items: [
				{
					label: "Permission",
					value: "permission",
					onClick: () => {
						closeMenu();
						useAppState.setState({ permissionMenuOpen: true });
					},
				},
			],
		},
	];

	return (
		<Command
			className={cn(
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 rounded-lg border p-1",
				state?.active ? "block" : "hidden"
			)}
			items={commandGroupData}
			value={state?.query}
		>
			<CommandInput ref={inputRef} wrapperClassName="hidden" />
			<CommandEmpty>No results</CommandEmpty>
			<CommandListTemplate groupClassName="p-0" />
		</Command>
	);
}

export function MentionMenu({
	state,
	inputRef,
	editor,
}: {
	state: MentionPluginState | undefined;
	inputRef: React.Ref<HTMLInputElement>;
	editor: Editor;
}) {
	const { charts, worksheets, activeChart, activeRange, activeShape } = useAppState();
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

	const mentionGroupData: CommandGroupData[] = [
		{
			// label: "Workbook",
			items: [
				...charts.map((chart) => ({
					value: chart.id,
					label: chart.name,
					shortcut: "Chart",
					onClick: () => insertMention({ id: chart.id, label: chart.name, editor, range: state!.range! }),
				})),
				...worksheets.map((worksheet) => ({
					value: worksheet.name,
					label: worksheet.name,
					shortcut: "Worksheet",
					onClick: () => insertMention({ id: worksheet.name, label: worksheet.name, editor, range: state!.range! }),
				})),
			],
		},
	];

	return (
		<Command
			className={cn(
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 rounded-lg border p-1",
				state?.active ? "block" : "hidden"
				// "origin-bottom transition-all duration-50 ease-in-out",
				// mentionState?.query == null ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
			)}
			items={mentionGroupData}
			value={state?.query}
		>
			<CommandInput ref={inputRef} wrapperClassName="hidden" />
			<CommandEmpty>No results</CommandEmpty>
			<CommandListTemplate groupClassName="p-0" />
		</Command>
	);
}
