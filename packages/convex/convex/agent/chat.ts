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
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	smoothStream,
	streamText,
} from "ai";
import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

export const chatHandler = httpAction(async (ctx, req) => {
	const auth = await ctx.auth.getUserIdentity();
	const { id: chatId, messages, workbook, agentConfig } = messageRequestSchema.parse(await req.json());
	const modelMessages = await convertToModelMessages(messages);

	// Handlers to the last message in the request
	const lastMessage = messages.at(-1)!;
	const isToolCallResponse = lastMessage.metadata?.finishReason === "tool-calls";

	// Handle saving to the db
	await ctx.runMutation(api.chat.functions.saveChat, {
		chatId,
		namespace: workbook.metadata.documentId,
		message: lastMessage,
	});

	const agentContext: AgentContext = { chatId };

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
					onFinish: async (props) => {
						await ctx.runMutation(api.chat.functions.saveMessage, { chatId, message: props.responseMessage });
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

// Use this pattern if you want resumable stream
// const [streamForResponse, streamForProcessing] = stream.tee();
// return createUIMessageStreamResponse({ stream: streamForResponse });
