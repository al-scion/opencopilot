import type { InferUITools } from "ai";
import type { AgentConfig } from "../config";
import { excelTools, readTools, writeTools } from "./excel";
// import { todoTools } from "./todo";
// import { webFetchTools } from "./webfetch";

export const toolRegistry = (modelId: string) => {
	// Do some processing here

	return {
		// ...todoTools,
		// ...webFetchTools,
		...excelTools,
	};
};

export type ToolDefinitions = InferUITools<ReturnType<typeof toolRegistry>>;
export type ToolNames = keyof ReturnType<typeof toolRegistry>;

export const resolveTools = ({ agentConfig }: { agentConfig: AgentConfig }): ToolNames[] => {
	// Do some processing here

	return ["editRange", "readWorksheet"];
};
