import { type InferUITools, tool } from "ai";
import { z } from "zod";
import {
	ExcelBorderIndex,
	ExcelBorderLineStyle,
	ExcelBorderWeight,
	ExcelFillPattern,
	ExcelHorizontalAlignment,
	ExcelRangeUnderlineStyle,
} from "../constants/excel";

// Tool definitions
export const editRange = tool({
	description: "Edit a range in a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
		values: z.array(z.array(z.string())),
		styles: z.array(z.string()),
	}),
	outputSchema: z.object({ result: z.string() }),
});

export const formatRange = tool({
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		format: z
			.object({
				fill: z
					.object({
						color: z.string().optional(),
						pattern: z.enum(ExcelFillPattern).optional(),
						patternColor: z.string().optional(),
					})
					.optional(),
				font: z
					.object({
						color: z.string().optional(),
						bold: z.boolean().optional(),
						italic: z.boolean().optional(),
						size: z.number().optional(),
						underline: z.enum(ExcelRangeUnderlineStyle).optional(),
					})
					.optional(),
				horizontalAlignment: z.enum(ExcelHorizontalAlignment).optional(),
				indentLevel: z
					.number()
					.optional()
					.refine((val) => val === undefined || (val >= 0 && val <= 250), {
						message: "indentLevel must be between 0 and 250",
					}),
			})
			.optional(),
		borders: z
			.array(
				z.object({
					color: z.string().optional(),
					style: z.enum(ExcelBorderLineStyle).optional(),
					weight: z.enum(ExcelBorderWeight).optional(),
					sideIndex: z.enum(ExcelBorderIndex),
				})
			)
			.optional(),
		numberFormat: z.string().optional(),
	}),
});

export const editRowsOrColumns = tool({
	description: "Insert or delete a row or column",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("The location at which new rows or columns should be inserted or deleted"),
		action: z.enum(["insertRow", "deleteRow", "insertColumn", "deleteColumn"]),
	}),
});

export const editWorksheet = tool({
	description: "Edit a worksheet",
	inputSchema: z.object({
		name: z.string(),
		color: z.string().optional(),
		position: z.number().optional(),
		rename: z.string().optional(),
	}),
});

export const writeComment = tool({
	description: "Write a comment to a cell",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
		comment: z.string(),
	}),
});

export const readWorksheet = tool({
	description: "Read a range in a worksheet. Leave the address blank to read the entire worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().optional().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
	}),
});

export const getScreenshot = tool({
	description: "Return the rendered range of the worksheet as an image",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().optional(),
	}),
	outputSchema: z.object({ url: z.string() }),
	toModelOutput: ({ output }) => ({ type: "content", value: [{ type: "image-url", url: output.url }] }),
});

export const createWorksheet = tool({
	description: "Create a new worksheet",
	inputSchema: z.object({
		name: z.string(),
		copyFrom: z.string().optional().describe("Optionally, create a copy of an existing worksheet"),
	}),
});

export const evaluateFormula = tool({
	description: "Evaluate the result of a formula",
	inputSchema: z.object({
		worksheet: z.string(),
		range: z.string(),
		formula: z.array(z.array(z.string())),
	}),
});

export const clearRange = tool({
	description: "Clear a range in a worksheet",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string().describe("Range in A1 notation, for example 'A1', 'A1:A10'"),
	}),
});

export const searchWorkbook = tool({
	description: "Search the workbook",
	inputSchema: z.object({
		query: z.string(),
		worksheet: z.string().optional().describe("Optional, search within a specific worksheet"),
	}),
});

export const traceFormula = tool({
	description: "Get the direct precendent of a cell",
	inputSchema: z.object({
		worksheet: z.string(),
		address: z.string(),
	}),
});

export const copyPaste = tool({
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
});

// Tool collections
export const writeTools = {
	editRange,
	copyPaste,
	clearRange,
};

export const readTools = {
	readWorksheet,
	searchWorkbook,
	traceFormula,
};

export const excelTools = {
	editRange,
	clearRange,
	writeComment,
	formatRange,
	copyPaste,
	editRowsOrColumns,
	readWorksheet,
	getScreenshot,
	editWorksheet,
	createWorksheet,
	searchWorkbook,
	evaluateFormula,
	traceFormula,
};

export type ExcelTools = InferUITools<typeof excelTools>;
export const excelToolNames = Object.keys(excelTools);
export type ExcelToolName = keyof typeof excelTools;
