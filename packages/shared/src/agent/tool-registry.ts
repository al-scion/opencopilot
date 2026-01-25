import type { Tool } from "@tanstack/ai";
import type { z } from "zod";
import * as excelTools from "../excel/tools";
import type { agentConfigSchema } from "./schema";

export const toolRegistry = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }): Tool[] => {
	const excelToolsAsArray = Object.values(excelTools);

	return [...excelToolsAsArray];
};

export const toolResolver = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }): Tool[] => {
	return [];
};
