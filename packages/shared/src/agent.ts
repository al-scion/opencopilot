// import { workbookStateSchema } from "@apps/taskpane/src/lib/excel/workbook";
import { ToolLoopAgent } from "ai";
import { z } from "zod";
import { agentConfigSchema } from "./config";
import { registry } from "./models/registry";

const callOptionsSchema = z.object({
	// workbookState: workbookStateSchema,
	agentConfig: agentConfigSchema,
});

export const excelAgent = new ToolLoopAgent({
	model: registry.languageModel("google/gemini-3-pro-preview"),
	callOptionsSchema,
	prepareCall: ({ options, ...settings }) => {
		return {
			options,
			...settings,
		};
	},
});
