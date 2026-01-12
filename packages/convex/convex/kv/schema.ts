import { defineTable } from "convex/server";
import { v } from "convex/values";

const kv = defineTable({
	key: v.string(),
	value: v.any(),
}).index("by_key", ["key"]);

export const kvTables = {
	kv,
};
