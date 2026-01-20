import type { z } from "zod";
import { getOfficeMetadata } from "./metadata";
import type { workbookStateSchema } from "./schema";

export const getWorkbookState = async (): Promise<z.infer<typeof workbookStateSchema>> => {
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
