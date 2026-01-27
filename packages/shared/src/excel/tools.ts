import { tool } from "ai";
import { z } from "zod";
import { EXCEL_CHART_TYPES } from "./constants";

const readWorksheet = tool({
	description: "Read a range in a worksheet. Leave the address blank to read the entire worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().optional(),
	}),
	outputSchema: z.object({
		formulas: z.array(z.array(z.any())),
		text: z.array(z.array(z.string())),
	}),
});

const getScreenshot = tool({
	description: "Get screenshot of a worksheet or specific range",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().optional(),
	}),
	outputSchema: z.object({
		base64String: z.string(),
	}),
	toModelOutput: ({ output }) => ({
		type: "content",
		value: [
			{
				type: "image-data",
				mediaType: "image/png",
				data: output.base64String,
			},
		],
	}),
});

const editRange = tool({
	description: "Edit a range in a worksheet",
	strict: true,
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
		values: z.array(z.array(z.string())),
	}),
	outputSchema: z.object({ result: z.array(z.array(z.string())) }),
});

const setBackgroundColour = tool({
	description: "Set the background colour of a range",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		colour: z.string(),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const evaluateFormula = tool({
	description: "Run formulas in a sandboxed environment",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		formulas: z.array(z.array(z.string())),
	}),
	outputSchema: z.object({ result: z.array(z.array(z.string())) }),
});

const copyPaste = tool({
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
		values: z.array(z.array(z.string())),
	}),
});

const clearRange = tool({
	description: "Clear a range in a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const writeComment = tool({
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

const readComments = tool({
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

const editWorksheet = tool({
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

const createWorksheet = tool({
	description: "Create a worksheet",
	inputSchema: z.object({
		name: z.string(),
		copyFrom: z.string().optional(),
		position: z.number().optional(),
		visibility: z.enum(["Visible", "Hidden"]).optional(),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const deleteWorksheet = tool({
	description: "Delete a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
	}),
});

const editWorksheetLayout = tool({
	description: "Insert or delete rows/columns",
	inputSchema: z.object({
		worksheet: z.string(),
		operation: z.enum(["insertRow", "deleteRow", "insertColumn", "deleteColumn"]),
		startIndex: z.number(),
		count: z.number(),
	}),
	outputSchema: z.object({ success: z.boolean() }),
});

const searchWorkbook = tool({
	description: "Search the workbook",
	inputSchema: z.object({
		query: z.string(),
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

const traceFormulaPrecedents = tool({
	description: "Trace the precedents for a formula in a cell",
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

const traceFormulaDependents = tool({
	description: "Trace the dependents for a formula in a cell",
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

const createChart = tool({
	description: "Create a chart",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		chartType: z.enum(EXCEL_CHART_TYPES),
		title: z
			.object({
				text: z.string().optional(),
				visible: z.boolean().optional(),
			})
			.optional(),
		legend: z.object({
			visible: z.boolean().optional(),
		}),
	}),
	outputSchema: z.object({
		base64String: z.string(),
	}),
	toModelOutput: ({ output }) => ({
		type: "content",
		value: [
			{
				type: "image-data",
				mediaType: "image/png",
				data: output.base64String,
			},
		],
	}),
});

export const excelTools = {
	createChart,
	readWorksheet,
	editRange,
	copyPaste,
	clearRange,
	writeComment,
	readComments,
	editWorksheet,
	createWorksheet,
	deleteWorksheet,
	editWorksheetLayout,
	searchWorkbook,
	traceFormulaPrecedents,
	traceFormulaDependents,
	getScreenshot,
	evaluateFormula,
	setBackgroundColour,
};
