import { defineSchema } from "convex/server";
import { chatTables } from "./chat/schema";
import { kvTables } from "./kv/schema";
import { storageTables } from "./storage/schema";

export default defineSchema({
	...kvTables,
	...storageTables,
	...chatTables,
});
