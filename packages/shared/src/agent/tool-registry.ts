import type { InferUITools } from "ai";
import type { z } from "zod";
import { excelTools } from "../excel/tools";
import type { agentConfigSchema } from "./config";

export const toolRegistry = (modelId: string) => {
	// Do some processing here

	return {
		...excelTools,
	};
};

export type ToolDefinitions = InferUITools<ReturnType<typeof toolRegistry>>;
export type ToolNames = keyof ReturnType<typeof toolRegistry>;

export const resolveTools = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }): ToolNames[] => {
	// Do some processing here

	return Object.keys(excelTools) as ToolNames[];
};
