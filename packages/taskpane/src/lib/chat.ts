import { Chat } from "@ai-sdk/react";
import { excelToolHandler, excelToolNames, getWorkbookState, type MessageType } from "@packages/shared";
import type { UIMessage } from "@tanstack/ai-react";
import { createChatClientOptions, fetchServerSentEvents } from "@tanstack/ai-react";
import type { useAuth } from "@workos-inc/authkit-react";
import {
	DefaultChatTransport,
	lastAssistantMessageIsCompleteWithApprovalResponses,
	lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { getAccessToken } from "@/lib/auth";
import { useAgentConfig, useAppState } from "@/lib/state";

export const createTanstackChat = ({ id, messages }: { id?: string; messages?: UIMessage[] } = {}) => {
	const chatOptions = createChatClientOptions({
		id: id ?? crypto.randomUUID(),
		initialMessages: messages ?? [],
		connection: fetchServerSentEvents(`${import.meta.env.VITE_SERVER_URL}/chat/tanstack`, {
			headers: {},
			body: async () => ({}),
		}),
		tools: [],
	});
	return chatOptions;
};

export const useChatTransport = (auth: ReturnType<typeof useAuth>) => {
	const transport = new DefaultChatTransport({
		api: `${import.meta.env.VITE_SERVER_URL}/chat`,
		headers: async () => ({
			Authorization: await getAccessToken(),
		}),
		body: async () => ({
			workbook: await getWorkbookState(),
			agentConfig: useAgentConfig.getState(),
		}),
	});
	return transport;
};

export const createChat = ({ id, messages }: { id?: string; messages?: MessageType[] } = {}) => {
	const chat = new Chat<MessageType>({
		id,
		messages,
		transport: new DefaultChatTransport({
			api: `${import.meta.env.VITE_SERVER_URL}/chat`,
			headers: async () => ({
				Authorization: `Bearer ${await getAccessToken()}`,
			}),
			body: async () => ({
				workbook: await getWorkbookState(),
				agentConfig: useAgentConfig.getState(),
			}),
		}),
		generateId: () => crypto.randomUUID(),
		sendAutomaticallyWhen:
			lastAssistantMessageIsCompleteWithToolCalls || lastAssistantMessageIsCompleteWithApprovalResponses,
		onFinish: async (args) => {},
		onData: async (args) => {},
		onError: async (args) => {},
		onToolCall: async ({ toolCall }) => {
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
						errorText: error instanceof Error ? error.message : "Unknown error",
						state: "output-error",
					});
				}
			}
		},
	});

	return chat;
};
