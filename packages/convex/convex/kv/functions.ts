import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getKV = query({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		const kv = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();

		if (!kv) {
			return null;
		}
		return kv.value;
	},
});

export const deleteKV = mutation({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		const kv = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();
		if (kv) {
			await ctx.db.delete(kv._id);
		}
	},
});

export const setKV = mutation({
	args: { key: v.string(), value: v.any() },
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();
		if (existing) {
			await ctx.db.delete(existing._id);
		} else {
			await ctx.db.insert("kv", args);
		}
	},
});
