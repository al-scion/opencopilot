import { generateTitlePrompt } from "@packages/shared/server";
import { chat, uiMessageToModelMessages } from "@tanstack/ai";
import { geminiText } from "@tanstack/ai-gemini";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const generateTitle = action({
	args: {
		chatId: v.string(),
		message: v.any(),
	},
	handler: async (ctx, args) => {
		const modelMessages = uiMessageToModelMessages(args.message);
		const title = await chat({
			adapter: geminiText("gemini-2.5-flash"),
			messages: modelMessages as any,
			systemPrompts: [generateTitlePrompt],
			stream: false,
		});

		await ctx.runMutation(api.chat.functions.updateChatTitle, {
			chatId: args.chatId,
			title,
		});
	},
});
