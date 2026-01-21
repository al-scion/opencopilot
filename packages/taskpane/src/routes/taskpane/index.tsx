import { useChat } from "@ai-sdk/react";
import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@packages/ui/components/ui/command";
import { toastManager } from "@packages/ui/components/ui/toast";
import { cn } from "@packages/ui/lib/utils";
import { fetchServerSentEvents, useChat as useTanstackChat } from "@tanstack/ai-react";
import { createFileRoute, redirect, useRouteContext } from "@tanstack/react-router";
import { Document } from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Mention, type MentionNodeAttrs, type MentionOptions } from "@tiptap/extension-mention";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, type Range, useEditor, useEditorState } from "@tiptap/react";

import type { FileUIPart } from "ai";
import { ArrowUp, Paperclip, Plus, SquareMousePointer, Table2 } from "lucide-react";
import { useRef, useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { AssistantMessage } from "@/components/chat/assistant-message";
import { ChatHistory } from "@/components/chat/chat-history";
import { CommandMenu, MentionPluginKey } from "@/components/chat/command-menu";
import { ErrorMessage } from "@/components/chat/error-message";
import { ModeSelector } from "@/components/chat/mode-selector";
import { ModelMenu } from "@/components/chat/model-menu";
import { UploadedFile } from "@/components/chat/uploaded-file";
import { UserMessage } from "@/components/chat/user-message";
import { SettingsMenu } from "@/components/settings-menu";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { saveFileToStorage } from "@/lib/excel/checkpoint";
import { useAppState, useChatStore } from "@/lib/state";
import type { MentionItem } from "@/lib/types";
import { fileToDataUrl } from "@/lib/utils";

export const Route = createFileRoute("/taskpane/")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {},
});

function RouteComponent() {
	// const [query, setQuery] = useState<string | null>(null);
	// const [queryRange, setQueryRange] = useState<Range | null>(null);
	const commandInputRef = useRef<HTMLInputElement>(null);
	const { worksheets, activeRange } = useAppState();
	const { chat, tanstackChat } = useChatStore();
	const { sendMessage, messages, status, stop, error } = useChat({ chat });

	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploadedFiles, setUploadedFiles] = useState<FileUIPart[]>([]);
	const handleRemoveFile = (file: FileUIPart) => {
		setUploadedFiles((prev) => prev.filter((f) => f.url !== file.url));
	};
	const fileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = event.target.files;
		Array.from(newFiles ?? []).forEach(async (file) => {
			if (!ALLOWED_MIME_TYPES.includes(file.type)) {
				toastManager.add({ type: "error", title: "File type not supported", timeout: 500 });
				return;
			}
			if (file.size > MAX_FILE_SIZE) {
				toastManager.add({ type: "error", title: "Maximum file size exceeded", timeout: 500 });
				return;
			}

			const fileUIPart: FileUIPart = {
				url: await fileToDataUrl(file),
				filename: file.name,
				type: "file",
				mediaType: file.type,
			};
			setUploadedFiles((prev) => [...prev, fileUIPart]);
		});
		// Then clear the files from the input
		event.target.value = "";
	};

	const newChat = () => {
		messages.length > 0 && useChatStore.setState({ chat: createChat() });
		editor.commands.clearContent();
		setUploadedFiles([]);
		editor.commands.focus();
	};

	useShortcut({ name: "newChat", action: newChat });
	useShortcut({ name: "stopChat", action: stop });

	const handleSendMessage = () => {
		if (editorState.isEmpty) {
			return;
		}

		const mentionNodes: MentionNodeAttrs[] = [];
		const mentionItems = editor.state.doc.descendants((node) => {
			if (node.type.name === "mention") {
				mentionNodes.push(node.attrs as MentionNodeAttrs);
			}
		});

		const checkpointId = crypto.randomUUID();
		saveFileToStorage(checkpointId);
		sendMessage({
			text: editor.getText(),
			metadata: { tiptap: editor.getJSON(), checkpointId },
			files: uploadedFiles,
		});
		setUploadedFiles([]);
		editor.commands.clearContent();
	};

	const worksheetOptions: MentionItem[] = worksheets.map((worksheet) => ({
		id: worksheet.name,
		label: worksheet.name,
		icon: Table2,
		menuLabel: worksheet.name,
		menuSubLabel: "Worksheet",
	}));
	const activeRangeOption: MentionItem = {
		id: activeRange.address,
		label: activeRange.address,
		icon: SquareMousePointer,
		menuLabel: activeRange.address.split("!")[1]!,
		menuSubLabel: "Selection",
	};

	const selectOptions: MentionItem[] = [activeRangeOption, ...worksheetOptions];

	const handleSelectMention = (id: string, label: string) => {
		editor
			.chain()
			.insertContentAt(editorState.suggestion!.range!, [
				{ type: "mention", attrs: { id, label } satisfies MentionNodeAttrs },
				{ type: "text", text: " " },
			])
			.focus()
			.run();
	};

	const editor = useEditor(
		{
			extensions: [
				Document,
				Paragraph,
				Text,
				HardBreak,
				Placeholder.configure({
					placeholder: (props) => {
						if (!props.editor.isFocused) {
							return "⌘J to focus chat, @ to mention";
						}
						return "⌘J to focus worksheet, @ to mention";
					},
				}),
				Mention.configure({
					deleteTriggerWithBackspace: true,
					suggestions: [
						{
							char: "@",
							allowSpaces: false,
							// pluginKey: SuggestionPluginKey,
							pluginKey: MentionPluginKey,
							// command: ({editor, props, range}) => {},
							render: () => ({
								onKeyDown: ({ event, range, view }) => {
									if (event.key === "ArrowDown" || event.key === "ArrowUp") {
										event.preventDefault();
										event.stopPropagation();
										const newEvent = new KeyboardEvent(event.type, {
											key: event.key,
											code: event.code,
											bubbles: true,
											cancelable: true,
										});
										commandInputRef.current?.dispatchEvent(newEvent);
										return true;
									}
									if (event.key === "Enter" || event.key === "Tab") {
										event.preventDefault();
										event.stopPropagation();
										const newEvent = new KeyboardEvent(event.type, {
											key: "Enter",
											code: "Enter",
											bubbles: true,
											cancelable: true,
										});
										commandInputRef.current?.dispatchEvent(newEvent);
										return true;
									}
									return false;
								},
							}),
						},
					],
				}),
			],
			autofocus: true,
			editorProps: {
				handleKeyDown: (view, event) => {
					if (event.key === "Enter" && event.shiftKey === false && editorState.suggestion?.active === false) {
						handleSendMessage();
						return true;
					}
					return false;
				},
				handleClick: (view, pos, event) => {
					const node = view.state.doc.nodeAt(pos);
					const isMention = node?.type.name === "mention";
				},
			},
			onCreate: ({ editor }) => {
				useAppState.setState({ editor });
			},
			onFocus: ({ editor }) => {
				useAppState.setState({ editor });
			},
			onUpdate: ({ editor }) => {
				useAppState.setState({ editor });
			},
		},
		[] // Insert dep array here
	);
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isEmpty: editor.isEmpty,
			isFocused: editor.isFocused,
			selection: editor.state.selection,
			suggestion: MentionPluginKey.getState(editor.state),
			// suggestion: SuggestionPluginKey.getState(editor.state) as MentionPluginState,
		}),
	});

	return (
		<>
			<div className={cn("flex flex-row items-center p-1.5")}>
				<ModeSelector />
				<div className="ml-auto flex flex-row items-center gap-0.5">
					<TooltipButton
						onClick={newChat}
						shortcutKeys={getShortcutString("newChat")}
						size="icon"
						tooltip="New chat"
						variant="ghost"
					>
						<Plus />
					</TooltipButton>
					<ChatHistory />
					<SettingsMenu />
				</div>
			</div>
			<pre>{JSON.stringify(editorState, null, 2)}</pre>
			<StickToBottom className="relative flex-1 overflow-y-auto" initial="instant" resize="instant">
				<StickToBottom.Content className="p-1.5 pt-0">
					{messages.map((message) => {
						if (message.role === "user") {
							return <UserMessage key={message.id} message={message} />;
						}
						if (message.role === "assistant") {
							return <AssistantMessage key={message.id} message={message} status={status} />;
						}
						return null;
					})}
					<ErrorMessage error={error} />
				</StickToBottom.Content>
			</StickToBottom>
			<Card className="relative m-1.5 mt-0">
				<CardContent className="p-0">
					<CardContentItem className={cn("px-2 py-1", !(status === "streaming" || status === "submitted") && "hidden")}>
						<span className="font-light text-muted-foreground text-xs">Generating...</span>
						<TooltipButton className="-mr-1 ml-auto rounded-sm" onClick={stop} size="sm" variant="secondary">
							<span className="font-normal text-muted-foreground text-xs">Stop</span>
							<span className="-mr-0.5 font-light text-muted-foreground text-xs">{getShortcutString("stopChat")}</span>
						</TooltipButton>
					</CardContentItem>
					<CardContentItem className={cn("p-2", uploadedFiles.length === 0 && "hidden")}>
						{uploadedFiles.map((file) => (
							<UploadedFile file={file} key={file.url} removeFile={() => handleRemoveFile(file)} />
						))}
					</CardContentItem>
					<CardContentItem className="flex-col items-start">
						<EditorContent className="w-full flex-1" editor={editor} />
						<div className="flex w-full flex-row">
							<div className="flex flex-row items-center gap-1">
								<TooltipButton
									onClick={() => fileInputRef.current?.click()}
									size="icon"
									tooltip="Files"
									variant="ghost"
								>
									<input
										accept={ALLOWED_MIME_TYPES.join(",")}
										className="hidden"
										multiple
										onChange={fileInputChange}
										ref={fileInputRef}
										type="file"
									/>
									<Paperclip />
								</TooltipButton>
								{/* <ToolMenu /> */}

								<ModelMenu />
							</div>
							<div className="ml-auto flex flex-row items-center gap-1">
								<TooltipButton
									className={cn("rounded-full", editorState.isEmpty && "bg-foreground/50 hover:bg-foreground/50")}
									onClick={handleSendMessage}
									shortcutKeys={"⏎"}
									size="icon"
									tooltip="Send"
								>
									<ArrowUp />
								</TooltipButton>
							</div>
						</div>
					</CardContentItem>
				</CardContent>
				<CommandMenu mentionState={editorState.suggestion} />
				{/* <CommandMenu mentionState={editorState.mention}} /> */}
				<Command
					className={cn(
						"absolute bottom-[calc(100%+4px)] left-1/2 h-fit w-[calc(100%-4px)] -translate-x-1/2 rounded-lg border shadow",
						editorState.suggestion?.query === null && "hidden"
					)}
					filter={(_value, search, keywords) => (keywords?.join().toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
					loop
				>
					<CommandInput ref={commandInputRef} value={editorState.suggestion?.query ?? ""} wrapperClassName="hidden" />
					<CommandList>
						<CommandEmpty>No results</CommandEmpty>
						<CommandGroup>
							{selectOptions.map((item, index) => (
								<CommandItem
									key={index}
									keywords={[item.menuLabel, item.menuSubLabel]}
									onSelect={(value) => handleSelectMention(value, item.label)}
									value={item.id}
								>
									<item.icon className="size-4" />
									<span className="truncate">{item.menuLabel}</span>
									<CommandShortcut className="tracking-normal">{item.menuSubLabel}</CommandShortcut>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</Card>
		</>
	);
}
