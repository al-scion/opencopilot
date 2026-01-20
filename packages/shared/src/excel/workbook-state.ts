import { z } from "zod";
import { officeMetadataSchema, getOfficeMetadata } from "./metadata";

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

type WorkbookState = z.infer<typeof workbookStateSchema>;

export const getWorkbookState = async (): Promise<WorkbookState> => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		const worksheets = context.workbook.worksheets.load({ name: true, position: true });
		const activeWorksheet = context.workbook.worksheets.getActiveWorksheet().load({ name: true });
		const selectedRange = context.workbook.getSelectedRange().load({ address: true });
		const activeWorksheetUsedRange = activeWorksheet.getUsedRange(true).load({ address: true });
		await context.sync();

		return {
			metadata: getOfficeMetadata(),
			workbookName: workbook.name,
			worksheets: worksheets.items.map((worksheet) => ({
				name: worksheet.name,
				position: worksheet.position,
			})),
			currentWorksheet: {
				name: activeWorksheet.name,
				usedRange: activeWorksheetUsedRange.address,
				selectedRange: selectedRange.address,
			},
		};
	});
};
