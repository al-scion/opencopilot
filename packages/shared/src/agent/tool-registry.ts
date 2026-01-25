import type { Tool } from "@tanstack/ai";
import type { z } from "zod";
import { editRangeDef, editWorksheetDef } from "../excel/ts-tools";
import type { agentConfigSchema } from "./schema";

export const toolRegistry = ({ agentConfig }: { agentConfig: z.infer<typeof agentConfigSchema> }): Tool[] => {
	return [editRangeDef, editWorksheetDef];
};
