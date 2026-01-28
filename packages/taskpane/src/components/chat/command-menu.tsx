import {
	Command,
	CommandEmpty,
	type CommandGroupData,
	CommandInput,
	CommandListTemplate,
} from "@packages/ui/components/ui/command";
import { cn } from "@packages/ui/lib/utils";
import { Mention, type MentionNodeAttrs } from "@tiptap/extension-mention";
import { PluginKey } from "@tiptap/pm/state";
import { type Editor, NodeViewWrapper, type Range, ReactNodeViewRenderer } from "@tiptap/react";
import { BoxIcon, CircleArrowRightIcon, PaperclipIcon, ShieldCheckIcon, UploadIcon } from "lucide-react";
import { getShortcutString } from "@/lib/browser-shortcuts";
import { useAppState } from "@/lib/state";

type MentionPluginState = {
	range: Range;
	query: string | null;
	text: string | null;
	active: boolean;
	composing: boolean;
	decorationId: string | null;
};

export const MentionPluginKey = new PluginKey<MentionPluginState>("mention");
export const CommandPluginKey = new PluginKey<MentionPluginState>("command");

// export const customMention = Mention.extend({
// 	addAttributes() {
// 		return {
// 			...this.parent?.(),
// 			category: undefined,
// 		};
// 	},
// 	addNodeView() {
// 		return ReactNodeViewRenderer(
// 			(props) => {
// 				const { id, label, mentionSuggestionChar, category } = props.node.attrs as MentionNodeAttrs & {
// 					category: string;
// 				};
// 				console.log(props.node.attrs);
// 				return (
// 					<NodeViewWrapper as="span" data-type={props.node.type.name}>
// 						{label}
// 						{/* <span className="border border-primary-200 bg-primary-50 text-primary-300">{label}</span> */}
// 					</NodeViewWrapper>
// 				);
// 			},
// 			{
// 				as: "span", // important for inline nodes!
// 			}
// 		);
// 	},
// });

export function CommandMenu({
	state,
	inputRef,
	editor,
	onAttachFile,
}: {
	state: MentionPluginState | undefined;
	inputRef: React.Ref<HTMLInputElement>;
	editor: Editor;
	onAttachFile: () => void;
}) {
	const { permissionMenuOpen } = useAppState();

	const closeMenu = () => editor.chain().deleteRange(state!.range).run();

	const commandGroupData: CommandGroupData[] = [
		{
			items: [
				{
					label: "Attach file",
					value: "attachFile",
					icon: <PaperclipIcon />,
					onClick: () => {
						closeMenu();
						onAttachFile();
					},
					shortcut: getShortcutString("uploadFile"),
				},
			],
		},
		{
			// label: "Customize",
			items: [
				{
					label: "Set permission",
					value: "permission",
					icon: <ShieldCheckIcon />,
					shortcut: getShortcutString("togglePermission"),
					onClick: () => {
						closeMenu();
						useAppState.setState({ permissionMenuOpen: true });
					},
				},
				{
					label: "Select model",
					value: "model",
					icon: <BoxIcon />,
					shortcut: getShortcutString("toggleModel"),
					onClick: () => {
						closeMenu();
						useAppState.setState({ modelMenuOpen: true });
					},
				},
			],
		},
		{
			items: [
				{
					label: "Test",
					value: "testSkill",
					icon: <CircleArrowRightIcon />,
					onClick: () => {
						editor
							.chain()
							.insertContentAt(state!.range, [
								{
									type: "mention",
									foo: "bar",
									attrs: {
										id: "testSkill",
										label: "Test skill",
										metadata: "skill",
									},
								},
								{ type: "text", text: " " },
							])
							.focus()
							.run();
					},
				},
			],
		},
	];

	return (
		<Command
			className={cn(
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 overflow-visible rounded-lg border bg-popover p-1 shadow-xs",
				state?.active ? "block" : "hidden"
			)}
			items={commandGroupData}
			value={state?.query ?? ""}
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
				"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 overflow-visible rounded-lg border bg-popover p-1 shadow-xs",
				state?.active ? "block" : "hidden"
				// "origin-bottom transition-all duration-50 ease-in-out",
				// mentionState?.query == null ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"
			)}
			items={mentionGroupData}
			value={state?.query ?? ""}
		>
			<CommandInput ref={inputRef} wrapperClassName="hidden" />
			<CommandEmpty>No results</CommandEmpty>
			<CommandListTemplate groupClassName="p-0" />
		</Command>
	);
}
