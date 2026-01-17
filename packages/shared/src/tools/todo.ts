// import { api } from "@packages/convex";
// import { tool } from "ai";
// import { z } from "zod";
// import type { AgentContext } from "../context";

// export const todoSchema = z.object({
// 	content: z.string().describe("Brief description of the task"),
// 	status: z.enum(["pending", "in_progress", "completed"]).describe("Current status of the task"),
// 	priority: z.string().describe("Priority level of the task: high, medium, low"),
// 	id: z.string().describe("Unique identifier for the todo item"),
// });
// export type Todo = z.infer<typeof todoSchema>;

// export const todoWrite = tool({
// 	description: "Use this tool to create and manage a structured task list for your current coding session",
// 	inputSchema: z.object({
// 		todos: z.array(todoSchema),
// 	}),
// 	execute: async (input, opts) => {
// 		const context = opts.experimental_context as AgentContext;
// 		await context.ctx.runMutation(api.kv.functions.setKV, {
// 			key: `todo:${context.chatId}`,
// 			value: input.todos,
// 		});
// 	},
// });

// export const todoRead = tool({
// 	description: "Use this tool to read your todo list",
// 	inputSchema: z.object({}),
// 	execute: async (input, opts) => {
// 		const context = opts.experimental_context as AgentContext;
// 		const todos = await context.ctx.runQuery(api.kv.functions.getKV, {
// 			key: `todo:${context.chatId}`,
// 		});
// 		return todos;
// 	},
// });

// export const todoTools = {
// 	todoWrite,
// 	todoRead,
// };
