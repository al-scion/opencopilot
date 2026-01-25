import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import { toastManager } from "@packages/ui/components/ui/toast";
import { useMutation } from "@tanstack/react-query";
import Document from "@tiptap/extension-document";
import HardBreak from "@tiptap/extension-hard-break";
import Mention from "@tiptap/extension-mention";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import { Loader2, Undo2 } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import type { UIMessage } from "@/lib/chat";
import { restoreCheckpoint } from "@/lib/excel/checkpoint";

export function UserMessage({ message }: { message: UIMessage }) {
	const textPart = message.parts.find((part) => part.type === "text");

	const { mutate: undoChanges, isPending } = useMutation({
		mutationFn: restoreCheckpoint,
		onSuccess: () => toastManager.add({ title: "Changes undone", timeout: 1000 }),
	});

	const editor = useEditor({
		content: textPart?.metadata?.tiptap as any,
		extensions: [Document, Paragraph, Text, HardBreak, Mention],
		editable: false,
	});
	const editorState = useEditorState({
		editor,
		selector: ({ editor }) => ({
			isEmpty: editor.isEmpty,
			isFocused: editor.isFocused,
			selection: editor.state.selection,
		}),
	});

	return (
		<Card>
			<CardContent>
				<CardContentItem className="relative">
					<EditorContent editor={editor} />
					<TooltipButton
						className="absolute right-2 bottom-2 size-5 hover:bg-background"
						onClick={() => undoChanges(message.id)}
						size="icon"
						tooltip="Undo changes"
						variant="ghost"
					>
						{isPending ? <Loader2 className="size-3.5 animate-spin" /> : <Undo2 className="size-3.5" />}
					</TooltipButton>
				</CardContentItem>
			</CardContent>
		</Card>
	);
}
