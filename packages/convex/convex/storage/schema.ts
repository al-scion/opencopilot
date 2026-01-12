import { defineTable } from "convex/server";
import { v } from "convex/values";

export const storage = defineTable({
	key: v.string(),
	name: v.string(),
	size: v.number(),
	mimeType: v.string(),
	sha256: v.optional(v.string()), // a base16 encoded sha256 checksum of the file contents
	namespace: v.optional(v.string()),
	metadata: v.optional(v.record(v.string(), v.any())),
})
	.index("by_key", ["key"])
	.index("by_name", ["name"])
	.index("by_mimeType", ["mimeType"])
	.index("by_size", ["size"])
	.index("by_namespace", ["namespace"])
	.index("by_sha256", ["sha256"]);

export const storageTables = {
	storage,
};
