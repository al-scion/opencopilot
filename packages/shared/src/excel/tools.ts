import { toolDefinition } from "@tanstack/ai";
import { z } from "zod";

const readWorksheetDef = toolDefinition({
	name: "readWorksheet",
	description: "Read a range in a worksheet. Leave the address blank to read the entire worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().optional(),
	}),
	outputSchema: z.object({
		formulas: z.string(),
		text: z.string(),
	}),
});

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

const copyPasteDef = toolDefinition({
	name: "copyPaste",
	description: "Copy and paste a range",
	inputSchema: z.object({
		source: z.object({
			worksheet: z.string(),
			address: z.string(),
		}),
		destination: z.object({
			worksheet: z.string(),
			address: z.string(),
		}),
	}),
	outputSchema: z.object({
		address: z.string(),
		values: z.string(),
	}),
});

const clearRangeDef = toolDefinition({
	name: "clearRange",
	description: "Clear a range in a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const writeCommentDef = toolDefinition({
	name: "writeComment",
	description: "Write comment or reply to a thread",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		comment: z.string(),
		resolved: z.boolean(),
	}),
	outputSchema: z.object({
		address: z.string(),
		isResolved: z.boolean(),
		thread: z.array(
			z.object({
				author: z.string(),
				content: z.string(),
				createdAt: z.string(),
			})
		),
	}),
});

const readCommentsDef = toolDefinition({
	name: "readComments",
	description: "Read all comments or from a specific worksheet",
	inputSchema: z.object({
		worksheet: z.string().optional(),
	}),
	outputSchema: z.object({
		count: z.number(),
		items: z.array(
			z.object({
				address: z.string(),
				isResolved: z.boolean(),
				thread: z.array(
					z.object({
						author: z.string(),
						content: z.string(),
						createdAt: z.string(),
					})
				),
			})
		),
	}),
});

const editWorksheetDef = toolDefinition({
	name: "editWorksheet",
	description: "Edit the configuration of a worksheet",
	inputSchema: z.object({
		name: z.string(),
		color: z.string().optional().describe("Hex code #RRGGBB"),
		position: z.number().optional(),
		rename: z.string().optional(),
		showGridlines: z.boolean().optional(),
		visibility: z.enum(["Visible", "Hidden"]).optional(),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const createWorksheetDef = toolDefinition({
	name: "createWorksheet",
	description: "Edit or create a worksheet",
	needsApproval: false,
	inputSchema: z.object({
		name: z.string(),
		copyFrom: z.string().optional(),
		color: z.string().optional().describe("Hex code #RRGGBB"),
		position: z.number().optional(),
		rename: z.string().optional(),
		showGridlines: z.boolean().optional(),
		visibility: z.enum(["Visible", "Hidden"]).optional(),
	}),
});

const deleteWorksheetDef = toolDefinition({
	name: "deleteWorksheet",
	description: "Delete a worksheet",
	needsApproval: true,
	inputSchema: z.object({
		worksheet: z.string(),
	}),
});

const editWorksheetLayoutDef = toolDefinition({
	name: "editWorksheetLayout",
	description: "Insert or delete rows/columns",
	inputSchema: z.object({
		worksheet: z.string(),
		operation: z.enum(["insertRow", "deleteRow", "insertColumn", "deleteColumn"]),
		startIndex: z.number(),
		count: z.number(),
	}),
});

const searchWorkbookDef = toolDefinition({
	name: "searchWorkbook",
	description: "Search the workbook",
	inputSchema: z.object({
		query: z.string(),
		worksheet: z.string().optional(),
	}),
	outputSchema: z.object({
		count: z.number(),
		items: z.array(
			z.object({
				address: z.string(),
				formula: z.string(),
				text: z.string(),
			})
		),
	}),
});

const traceFormulaPrecedentsDef = toolDefinition({
	name: "traceFormulaPrecedents",
	description: "Trace the precedents for a formula in a cell",
	needsApproval: false,
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
	}),
	outputSchema: z.object({
		targetFormula: z.string(),
		targetValue: z.string(),
		count: z.number(),
		items: z.array(
			z.object({
				address: z.string(),
				values: z.array(z.array(z.string())),
				formulas: z.array(z.array(z.string())),
			})
		),
	}),
});

const traceFormulaDependentsDef = toolDefinition({
	name: "traceFormulaDependents",
	description: "Trace the dependents for a formula in a cell",
	needsApproval: false,
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
	}),
	outputSchema: z.object({
		targetFormula: z.string(),
		targetValue: z.string(),
		count: z.number(),
		items: z.array(
			z.object({
				address: z.string(),
				values: z.array(z.array(z.string())),
				formulas: z.array(z.array(z.string())),
			})
		),
	}),
});

export {
	editRangeDef,
	clearRangeDef,
	writeCommentDef,
	readCommentsDef,
	editWorksheetDef,
	searchWorkbookDef,
	traceFormulaPrecedentsDef,
	traceFormulaDependentsDef,
	readWorksheetDef,
	copyPasteDef,
	editWorksheetLayoutDef,
	createWorksheetDef,
	deleteWorksheetDef,
};
