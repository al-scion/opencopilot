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
	generateText,
	NoSuchToolError,
	Output,
	smoothStream,
	streamText,
} from "ai";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../index";

export const chatRouter = new Hono<{ Bindings: Env; Variables: Variables }>().post("/", async (c) => {
	const { id, messages, agentConfig, workbookState, officeMetadata } = chatRequestSchema.parse(await c.req.json());

	const lastMessage = messages.at(-1)!;
	const isToolCallResponse = lastMessage.metadata?.finishReason === "tool-calls";

	const provider = languageModelRegistry[agentConfig.model].provider;
	const providerOptions = { [provider]: languageModelRegistry[agentConfig.model].options };
	const tools = toolRegistry({ agentConfig });
	const modelMessages = await convertToModelMessages(messages, { tools });
	// console.log(modelMessages);

	c.var.convex.mutation(api.chat.functions.saveChat, {
		chatId: id,
		message: lastMessage,
		namespace: officeMetadata.id,
	});

	const stream = createUIMessageStream<UIMessageType>({
		execute: async ({ writer }) => {
			const response = streamText({
				model: modelRegistry.languageModel(agentConfig.model),
				messages: modelMessages,
				system: getSystemPrompt({ workbookState, agentConfig }),
				providerOptions,
				tools,
				experimental_repairToolCall: async (props) => {
					if (NoSuchToolError.isInstance(props.error)) {
						return null; // do not attempt to fix invalid tool names
					}
					console.log("repair tool call triggered");

					const response = await generateText({
						model: modelRegistry.languageModel("anthropic/claude-haiku-4-5"),
						output: Output.json({}),
						prompt: `
						The model tried to call the tool ${props.toolCall.toolName} with the following input: ${props.toolCall.input}.
						The tool accepts the following schema ${props.inputSchema(props.toolCall)}
						Please fix the input as a valid JSON object
						`,
					});
					return {
						type: "tool-call",
						toolCallId: props.toolCall.toolCallId,
						toolName: props.toolCall.toolName,
						input: JSON.stringify(response.output),
					};
				},
				onError: (error) => console.error(error),
				experimental_transform: [smoothStream()],
			});

			writer.merge(
				response.toUIMessageStream({
					originalMessages: messages,
					sendSources: true,
					generateMessageId: () => (isToolCallResponse ? lastMessage.id : crypto.randomUUID()),
					onFinish: async ({ responseMessage }) => {
						await c.var.convex.mutation(api.chat.functions.saveMessage, { chatId: id, message: responseMessage });
					},

					messageMetadata: ({ part }) => {
						if (part.type === "start-step") {
							return { startTime: Date.now() };
						}
						if (part.type === "finish-step") {
							return { endTime: Date.now() };
						}
						if (part.type === "reasoning-start") {
							console.log(part);
							return {};
						}
						if (part.type === "reasoning-end") {
							console.log(part);
							return {};
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
