import type { workbookStateSchema } from "@packages/shared";
import type { z } from "zod";

export const getWorkbookState = async (): Promise<z.infer<typeof workbookStateSchema>> => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		const worksheets = context.workbook.worksheets.load({ name: true, position: true });
		const selectedRange = context.workbook.getSelectedRange().load({ address: true });
		await context.sync();

		const worksheetsWithUsedRange = worksheets.items.map((worksheet) => ({
			name: worksheet.name,
			position: worksheet.position,
			usedRange: worksheet.getUsedRangeOrNullObject(true).load({ address: true }),
		}));
		await context.sync();

		return {
			workbookName: workbook.name,
			worksheets: worksheetsWithUsedRange.map((worksheet) => ({
				name: worksheet.name,
				position: worksheet.position,
				usedRange: worksheet.usedRange.isNullObject ? null : worksheet.usedRange.address,
			})),
			selectedRange: selectedRange.address,
		};
	});
};
