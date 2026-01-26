import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessageType } from "@packages/shared";
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
import { ArrowUp, PlusIcon } from "lucide-react";
import { useRef, useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { CommandMenu, MentionPluginKey } from "@/components/chat/command-menu";
import { ModeSelector } from "@/components/chat/mode-selector";
import { ModelMenu } from "@/components/chat/model-menu";
import { TooltipButton } from "@/components/tooltip-button";
import { AssistantMessage } from "./assistant-message";
import { ErrorMessage } from "./error-message";
import { UploadedFile } from "./uploaded-file";
import { UserMessage } from "./user-message";

export function ChatMessages({ chat }: { chat: UseChatHelpers<UIMessageType> }) {
	const { messages, error } = chat;
	return (
		<StickToBottom className="relative flex-1 overflow-y-auto" initial="instant" resize="instant">
			<StickToBottom.Content className="p-1.5 pt-0">
				{messages.map((message) => {
					if (message.role === "user") {
						return <UserMessage key={message.id} message={message} />;
					}
					if (message.role === "assistant") {
						return <AssistantMessage key={message.id} message={message} />;
					}
					return null;
				})}
				<ErrorMessage error={error} />
			</StickToBottom.Content>
		</StickToBottom>
	);
}
