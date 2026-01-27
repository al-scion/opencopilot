import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessageType } from "@packages/shared";
import { languageModelRegistry } from "@packages/shared";
import { ProgressRing } from "@packages/ui/components/progress-ring";
import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import { toastManager } from "@packages/ui/components/ui/toast";
import { cn } from "@packages/ui/lib/utils";
import { Document } from "@tiptap/extension-document";
import { HardBreak } from "@tiptap/extension-hard-break";
import { Mention } from "@tiptap/extension-mention";
import { Paragraph } from "@tiptap/extension-paragraph";
import { Text } from "@tiptap/extension-text";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { exitSuggestion } from "@tiptap/suggestion";
import type { FileUIPart } from "ai";
import { ArrowUp, PlusIcon, SquareIcon } from "lucide-react";
import { useRef, useState } from "react";
import { CommandMenu, CommandPluginKey, MentionMenu, MentionPluginKey } from "@/components/chat/command-menu";
import { ModelMenu } from "@/components/chat/model-menu";
import { PermissionMenu } from "@/components/chat/permission-menu";
import { TooltipButton } from "@/components/tooltip-button";
import { useShortcut } from "@/lib/browser-shortcuts";
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE } from "@/lib/constants";
import { getCheckpointId, saveFileToStorage } from "@/lib/excel/checkpoint";
import { useAgentConfig, useAppState } from "@/lib/state";
import { fileToDataUrl } from "@/lib/utils";

export function ChatInput({ chat }: { chat: UseChatHelpers<UIMessageType> }) {
	const { model } = useAgentConfig();

	const [uploadedFiles, setFiles] = useState<FileUIPart[]>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const commandInputRef = useRef<HTMLInputElement>(null);
	const mentionInputRef = useRef<HTMLInputElement>(null);

	const contextWindow = languageModelRegistry[model].contextWindow;
	const usage = chat.messages.findLast((m) => m.metadata?.usage?.totalTokens)?.metadata?.usage?.totalTokens ?? 0;
	const isLoading = chat.status === "streaming" || chat.status === "submitted";

	const editor = useEditor(
		{
			extensions: [
				Document,
				Paragraph,
				Text,
				HardBreak,
				Placeholder.configure({
					placeholder: (props) => {
						if (props.editor.isFocused) {
							return "@ to mention, / for commands";
						}
						return "⌘J to focus input";
					},
				}),
				Mention.configure({
					deleteTriggerWithBackspace: true,
					suggestions: [
						{
							char: "@",
							allowSpaces: false,
							pluginKey: MentionPluginKey,
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
										mentionInputRef.current?.dispatchEvent(newEvent);
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
										mentionInputRef.current?.dispatchEvent(newEvent);
										return true;
									}
									if (event.key === "Escape") {
										exitSuggestion(view, MentionPluginKey);
										return true;
									}
									return false;
								},
							}),
						},
						{
							char: "/",
							allowSpaces: false,
							pluginKey: CommandPluginKey,
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
									if (event.key === "Escape") {
										exitSuggestion(view, CommandPluginKey);
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
					if (
						event.key === "Enter" &&
						event.shiftKey === false &&
						editorState.mention?.active === false &&
						editorState.command?.active === false
					) {
						handleSendMessage();
						return true;
					}
					return false;
				},
				handleClick: (view, pos, event) => {
					const node = view.state.doc.nodeAt(pos);
					const isMention = node?.type.name === "mention";
					// Handle navigation
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
			mention: MentionPluginKey.getState(editor.state),
			command: CommandPluginKey.getState(editor.state),
		}),
	});

	const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files ?? []);
		files.forEach(async (file) => {
			if (!ALLOWED_MIME_TYPES.includes(file.type)) {
				toastManager.add({ type: "error", title: "File type not supported", timeout: 500 });
				return;
			}
			if (file.size > MAX_FILE_SIZE) {
				toastManager.add({ type: "error", title: "Maximum file size exceeded", timeout: 500 });
				return;
			}
			const dataUrl = await fileToDataUrl(file);
			setFiles((prev) => [...prev, { type: "file", mediaType: file.type, filename: file.name, url: dataUrl }]);
		});
		event.target.value = "";
	};

	const handleSendMessage = () => {
		if (editorState.isEmpty) {
			return;
		}
		const checkpointId = getCheckpointId();
		saveFileToStorage(checkpointId);
		chat.sendMessage({
			metadata: { tiptap: editor.getJSON(), checkpointId },
			files: uploadedFiles,
			text: editor.getText(),
		});
		setFiles([]);
		editor.commands.clearContent();
	};

	useShortcut({ name: "stopChat", action: chat.stop });

	return (
		<Card className="relative m-1.5 mt-0 rounded-2xl">
			<CardContent className="rounded-xl p-0">
				{/* <CardContentItem className={cn("px-2 py-1", isLoading === false && "hidden")}>
						<span className="font-light text-muted-foreground text-xs">Generating...</span>
						<TooltipButton className="-mr-1 ml-auto rounded-sm" onClick={stop} size="sm" variant="secondary">
							<span className="font-normal text-muted-foreground text-xs">Stop</span>
							<span className="-mr-0.5 font-light text-muted-foreground text-xs">{getShortcutString("stopChat")}</span>
						</TooltipButton>
					</CardContentItem> */}
				{/* <CardContentItem className={cn("p-2", uploadedContent.length === 0 && "hidden")}>
					{uploadedContent.map((content, index) => (
						<UploadedFile content={content} key={index} remove={() => handleRemoveContent(content)} />
					))}
				</CardContentItem> */}
				<CardContentItem className="flex-col items-start">
					<EditorContent className="w-full flex-1" editor={editor} />
					<div className="flex w-full flex-row">
						<div className="flex flex-row items-center gap-1">
							<TooltipButton
								className="bg-muted"
								onClick={() => fileInputRef.current?.click()}
								size="icon"
								tooltip="Upload files"
								variant="ghost"
							>
								<input
									accept={ALLOWED_MIME_TYPES.join(",")}
									className="hidden"
									multiple
									onChange={handleFileInputChange}
									ref={fileInputRef}
									type="file"
								/>
								<PlusIcon />
							</TooltipButton>
							<ModelMenu />
							<PermissionMenu />
						</div>
						<div className="ml-auto flex flex-row items-center gap-1">
							<TooltipButton
								className={cn("cursor-default hover:bg-transparent", usage === 0 && "hidden")}
								shortcutKeys="tokens"
								size="icon"
								tooltip={usage.toLocaleString()}
								variant="ghost"
							>
								<ProgressRing size={16} strokeWidth={2} value={(usage / contextWindow) * 100} />
							</TooltipButton>
							<TooltipButton
								className={cn("rounded-sm", editorState.isEmpty && "bg-foreground/50 hover:bg-foreground/50")}
								onClick={handleSendMessage}
								shortcutKeys={"⏎"}
								size="icon"
								tooltip="Send"
							>
								{isLoading ? (
									<svg className="size-3" fill="currentColor" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
										<rect height="16" rx="3" width="16" />
									</svg>
								) : (
									<ArrowUp />
								)}
							</TooltipButton>
						</div>
					</div>
				</CardContentItem>
			</CardContent>
			<CommandMenu editor={editor} inputRef={commandInputRef} state={editorState.command} />
			<MentionMenu editor={editor} inputRef={mentionInputRef} state={editorState.mention} />
		</Card>
	);
}
