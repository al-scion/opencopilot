import type { UseChatHelpers } from "@ai-sdk/react";
import type { UIMessageType } from "@packages/shared";
import { StickToBottom } from "use-stick-to-bottom";
import { AssistantMessage } from "./assistant-message";
import { ErrorMessage } from "./error-message";
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
