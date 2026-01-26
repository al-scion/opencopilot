import { api } from "@packages/convex";
import {
	chatRequestSchema,
	getSystemPrompt,
	languageModelRegistry,
	modelRegistry,
	toolRegistry,
	toolResolver,
	type UIMessageType,
} from "@packages/shared/server";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	smoothStream,
	streamText,
} from "ai";
import { Hono } from "hono";
import type { Variables } from "../index";

export const chatRouter = new Hono<{ Bindings: Env; Variables: Variables }>().post("/", async (c) => {
	const { id, messages, agentConfig, workbookState } = chatRequestSchema.parse(await c.req.json());
	const modelMessages = await convertToModelMessages(messages);
	const lastMessage = messages.at(-1)!;
	const isToolCallResponse = lastMessage.metadata?.finishReason === "tool-calls";

	const provider = languageModelRegistry[agentConfig.model].provider;
	const providerOptions = { [provider]: languageModelRegistry[agentConfig.model].options };
	const stream = createUIMessageStream<UIMessageType>({
		execute: async ({ writer }) => {
			const response = streamText({
				model: modelRegistry.languageModel(agentConfig.model),
				providerOptions,
				messages: modelMessages,
				system: getSystemPrompt({ workbookState, agentConfig }),
				tools: toolRegistry({ agentConfig }),
				// activeTools: toolResolver({ agentConfig }),
				onError: (error) => console.error(error),
				experimental_transform: [smoothStream()],
			});

			writer.merge(
				response.toUIMessageStream({
					originalMessages: messages,
					sendSources: true,
					generateMessageId: () => (isToolCallResponse ? lastMessage.id : crypto.randomUUID()),
					onFinish: ({ responseMessage }) => {
						c.var.convex.mutation(api.chat.functions.saveMessage, { chatId: id, message: responseMessage });
					},
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
