import { defineTable } from "convex/server";
import { v } from "convex/values";

const chat = defineTable({
	userId: v.string(),
	namespace: v.string(),
	chatId: v.string(),
	title: v.optional(v.string()),
	updatedAt: v.number(),
})
	.index("by_chatId", ["chatId"])
	.index("by_userId_namespace", ["userId", "namespace"])
	.index("by_userId_namespace_updatedAt", ["userId", "namespace", "updatedAt"]);

const message = defineTable({
	chatId: v.string(),
	messageId: v.string(),
	message: v.any(),
})
	.index("by_chatId", ["chatId"])
	.index("by_messageId", ["messageId"]);

export const chatTables = {
	chat,
	message,
};
