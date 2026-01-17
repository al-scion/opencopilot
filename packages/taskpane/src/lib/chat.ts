import { Chat } from "@ai-sdk/react";
import { excelToolHandler, excelToolNames, type MessageType } from "@packages/shared";
import {
	DefaultChatTransport,
	lastAssistantMessageIsCompleteWithApprovalResponses,
	lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { server } from "@/lib/server";
import { useAppState } from "@/lib/state";
import { getWorkbookState } from "./excel/workbook";

export const createChat = ({ id, messages }: { id?: string; messages?: MessageType[] } = {}) => {
	const chat = new Chat<MessageType>({
		id,
		messages,
		transport: new DefaultChatTransport({
			api: server.chat.$url().href,
			headers: async () => ({
				// Authorization: `Bearer ${await useAppState.getState().auth.getAccessToken()}`,
			}),
			body: async () => ({
				workbook: await getWorkbookState(),
				agentConfig: useAppState.getState().agentConfig,
			}),
		}),
		generateId: () => crypto.randomUUID(),
		sendAutomaticallyWhen:
			lastAssistantMessageIsCompleteWithToolCalls || lastAssistantMessageIsCompleteWithApprovalResponses,
		onFinish: async (args) => {},
		onData: async (args) => {},
		onError: async (args) => {},
		onToolCall: async ({ toolCall }) => {
			// console.log("toolCall", toolCall);
			const { toolName, toolCallId } = toolCall;

			if (excelToolNames.includes(toolName)) {
				try {
					const result = await excelToolHandler(toolCall);
					chat.addToolOutput({
						tool: toolName as never,
						toolCallId,
						output: result as never,
					});
				} catch (error) {
					chat.addToolOutput({
						tool: toolName as never,
						toolCallId,
						errorText: error instanceof Error ? error.message : String(error),
						state: "output-error",
					});
				}
			}
		},
	});

	console.log("created new chat", chat.id);

	useAppState.setState({ chat });

	return chat;
};
