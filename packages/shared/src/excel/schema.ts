import { z } from "zod";

export const officeMetadataSchema = z.object({
	id: z.string(),
});

export const workbookStateSchema = z.object({
	workbookName: z.string(),
	activeWorksheet: z.string(),
	worksheets: z.array(
		z.object({
			name: z.string(),
			position: z.number(),
			usedRange: z.string().nullable(),
		})
	),
	activeSelection: z.object({
		type: z.enum(["shape", "chart", "range"]),
		data: z.any(),
	}),
});
