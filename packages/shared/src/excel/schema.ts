import { z } from "zod";

export const officeMetadataSchema = z.object({
	id: z.string(),
});

export const workbookStateSchema = z.object({
	metadata: officeMetadataSchema,
	workbookName: z.string(),
	worksheets: z.array(
		z.object({
			name: z.string(),
			position: z.number(),
		})
	),
	currentWorksheet: z.object({
		name: z.string(),
		usedRange: z.string(),
		selectedRange: z.string(),
	}),
});
