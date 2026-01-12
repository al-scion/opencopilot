import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { kvTables } from "./schema";

export const getKV = query({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		const kv = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();
		return kv?.value;
	},
});

export const deleteKV = mutation({
	args: { key: v.string() },
	handler: async (ctx, args) => {
		const kv = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();

		kv && (await ctx.db.delete(kv._id));
	},
});

export const setKV = mutation({
	args: kvTables.kv.validator,
	handler: async (ctx, args) => {
		const existing = await ctx.db
			.query("kv")
			.withIndex("by_key", (q) => q.eq("key", args.key))
			.unique();

		existing
			? await ctx.db.patch(existing._id, { value: args.value })
			: await ctx.db.insert("kv", args);
	},
});
