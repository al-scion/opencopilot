import { google } from "@ai-sdk/google";
import { generateTitlePrompt } from "@packages/shared";
import { convertToModelMessages, generateText } from "ai";
import { v } from "convex/values";
import { api } from "../_generated/api";
import { action } from "../_generated/server";

export const generateTitle = action({
	args: {
		chatInternalId: v.id("chat"),
		message: v.any(),
	},
	handler: async (ctx, args) => {
		const response = await generateText({
			model: google("gemini-2.5-flash"),
			system: generateTitlePrompt,
			messages: await convertToModelMessages([args.message]),
		});

		await ctx.runMutation(api.chat.functions.updateChat, {
			chatInternalId: args.chatInternalId,
			title: response.text,
		});
	},
});
