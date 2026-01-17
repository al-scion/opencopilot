import { api } from "@packages/convex";
import {
	type AgentContext,
	defaultProviderOptions,
	getSystemPrompt,
	type MessageType,
	messageRequestSchema,
	modelRegistry,
	resolveTools,
	toolRegistry,
} from "@packages/shared";
// import { resolveTools, toolRegistry } from "@packages/shared/src/tools/registry";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	smoothStream,
	streamText,
} from "ai";
import { Hono } from "hono";
import type { Variables } from "../index";

export const chatRouter = new Hono<{ Variables: Variables }>().post("/", async (c) => {
	const { id: chatId, messages, workbook, agentConfig } = messageRequestSchema.parse(await c.req.json());
	const modelMessages = await convertToModelMessages(messages);

	// Handlers to the last message in the request
	const lastMessage = messages.at(-1)!;
	const isToolCallResponse = lastMessage.metadata?.finishReason === "tool-calls";

	c.var.convex.mutation(api.chat.functions.saveChat, {
		chatId,
		message: lastMessage,
		namespace: workbook.metadata.documentId,
	});

	const agentContext: AgentContext = {
		chatId,
	};

	const stream = createUIMessageStream<MessageType>({
		execute: async ({ writer }) => {
			const response = streamText({
				model: modelRegistry.languageModel(agentConfig.model),
				system: getSystemPrompt({ workbookState: workbook, agentConfig }),
				messages: modelMessages,
				tools: toolRegistry(agentConfig.model),
				activeTools: resolveTools({ agentConfig }),
				onAbort: (event) => {},
				onError: (error) => console.error(error),
				onChunk: ({ chunk }) => {},
				onStepFinish: (props) => {},
				onFinish: (props) => {},
				providerOptions: defaultProviderOptions,
				experimental_transform: [smoothStream()],
				experimental_context: agentContext,
			});

			writer.merge(
				response.toUIMessageStream({
					originalMessages: messages,
					sendSources: true,
					generateMessageId: () => (isToolCallResponse ? lastMessage.id : crypto.randomUUID()),
					onFinish: async (props) => {},
					messageMetadata: ({ part }) => {
						if (part.type === "start-step") {
							return { startTime: Date.now() };
						}
						if (part.type === "finish-step") {
							return { endTime: Date.now() };
						}
						if (part.type === "finish") {
							return { finishReason: part.finishReason, usage: part.totalUsage };
						}
						if (part.type === "start") {
							return;
						}
					},
				})
			);
		},
	});
	return createUIMessageStreamResponse({ stream });
});
