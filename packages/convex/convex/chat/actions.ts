import { google } from "@ai-sdk/google";
import { generateTitlePrompt } from "@packages/shared/server";
import { convertToModelMessages, generateText } from "ai";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const generateTitle = action({
	args: {
		chatId: v.string(),
		message: v.any(),
	},
	handler: async (ctx, args) => {
		const response = await generateText({
			model: google("gemini-2.5-flash"),
			system: generateTitlePrompt,
			messages: await convertToModelMessages([args.message]),
		});
		const title = response.text;

		await ctx.runMutation(api.chat.functions.updateChat, {
			chatId: args.chatId,
			title,
		});
	},
});
