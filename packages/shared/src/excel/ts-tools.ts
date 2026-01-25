import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const editRangeDef = toolDefinition({
	name: "editRange",
	description: "Edit a range in a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
		values: z.array(z.array(z.string())),
	}),
	outputSchema: z.object({ result: z.string() }),
});

const editWorksheetDef = toolDefinition({
	name: "editWorksheet",
	description: "Edit the configuration of a worksheet",
	inputSchema: z.object({
		name: z.string(),
		color: z.string().optional().describe("Hex code #RRGGBB"),
		position: z.number().optional(),
		rename: z.string().optional(),
	}),
});

export { editRangeDef, editWorksheetDef };
