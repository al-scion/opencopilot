import { v } from "convex/values";
import { api } from "../_generated/api";
import { mutation, query } from "../_generated/server";

export const saveChat = mutation({
	args: {
		chatId: v.string(),
		namespace: v.string(),
		message: v.any(),
	},
	handler: async (ctx, args) => {
		const auth = await ctx.auth.getUserIdentity();
		const userId = auth?.subject ?? "public";
		const chat = await ctx.db
			.query("chat")
			.withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
			.unique();

		if (chat) {
			await ctx.db.patch("chat", chat._id, {
				updatedAt: Date.now(),
			});
		} else {
			await ctx.db.insert("chat", {
				userId,
				namespace: args.namespace,
				chatId: args.chatId,
				updatedAt: Date.now(),
			});
			ctx.scheduler.runAfter(0, api.chat.actions.generateTitle, {
				chatId: args.chatId,
				message: args.message,
			});
		}

		await ctx.runMutation(api.chat.functions.saveMessage, {
			chatId: args.chatId,
			message: args.message,
		});
	},
});

export const saveMessage = mutation({
	args: {
		chatId: v.string(),
		message: v.any(),
	},
	handler: async (ctx, args) => {
		const existingMessage = await ctx.db
			.query("message")
			.withIndex("by_messageId", (q) => q.eq("messageId", args.message.id))
			.unique();
		if (existingMessage) {
			await ctx.db.patch("message", existingMessage._id, {
				message: args.message,
			});
		} else {
			await ctx.db.insert("message", {
				chatId: args.chatId,
				messageId: args.message.id,
				message: args.message,
			});
		}
	},
});

export const updateChatTitle = mutation({
	args: {
		chatId: v.string(),
		title: v.string(),
	},
	handler: async (ctx, args) => {
		const chat = await ctx.db
			.query("chat")
			.withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
			.unique();

		await ctx.db.patch("chat", chat!._id, {
			title: args.title,
		});
	},
});

export const getChats = query({
	args: {
		namespace: v.string(),
	},
	handler: async (ctx, args) => {
		const auth = await ctx.auth.getUserIdentity();
		const userId = auth?.subject ?? "public";
		// if (!auth) {
		// 	throw new Error("Unauthorized");
		// }
		const chats = await ctx.db
			.query("chat")
			.withIndex("by_userId_namespace_updatedAt", (q) => q.eq("userId", userId).eq("namespace", args.namespace))
			.order("desc")
			.take(20);
		return chats;
	},
});

export const getMessages = query({
	args: { chatId: v.string() },
	handler: async (ctx, args) => {
		const messages = await ctx.db
			.query("message")
			.withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
			.collect();
		return messages;
	},
});
