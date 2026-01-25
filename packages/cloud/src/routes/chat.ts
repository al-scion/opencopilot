import { chatRequestSchema, getSystemPrompt, languageModelRegistry, toolRegistry } from "@packages/shared/server";
import { chat, toServerSentEventsResponse } from "@tanstack/ai";
import { Hono } from "hono";
import type { Variables } from "../index";

export const chatRouter = new Hono<{ Bindings: Env; Variables: Variables }>().post("/", async (c) => {
	const { messages, data, agentConfig, workbookState } = chatRequestSchema.parse(await c.req.json());

	const modelConfig = languageModelRegistry[agentConfig.model];
	const stream = chat({
		conversationId: data.conversationId,
		adapter: modelConfig.adapter(),
		modelOptions: modelConfig.options,
		messages,
		tools: toolRegistry({ agentConfig }),
		systemPrompts: [getSystemPrompt({ workbookState, agentConfig })],
		stream: true,
	});

	return toServerSentEventsResponse(stream);
});
