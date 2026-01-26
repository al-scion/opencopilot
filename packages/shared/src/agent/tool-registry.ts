import type { z } from "zod";
import { excelTools } from "../excel/tools";
import type { agentConfigSchema } from "./schema";

export const toolRegistry = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }) => {
	return { ...excelTools };
};

type ToolOptions = keyof ReturnType<typeof toolRegistry>;

export const toolResolver = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }): ToolOptions[] => {
	return [];
};
