import { R2 } from "@convex-dev/r2";
import { v } from "convex/values";
import { api, components } from "../_generated/api";
import { action, mutation, query } from "../_generated/server";
import { storageTables } from "./schema";

export const r2 = new R2(components.r2);

export const createFile = mutation({
	args: storageTables.storage.validator,
	handler: async (ctx, args) => {
		await ctx.db.insert("storage", args);
	},
});

export const getFilesByNamespace = query({
	args: {
		namespace: v.string(),
	},
	handler: async (ctx, args) => {
		const files = await ctx.db
			.query("storage")
			.withIndex("by_namespace", (q) => q.eq("namespace", args.namespace))
			.collect();
		return files;
	},
});
