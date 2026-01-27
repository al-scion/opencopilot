import type { workbookStateSchema } from "@packages/shared";
import type { z } from "zod";
import { getActiveSelection } from "@/lib/excel/utils";

export const getWorkbookState = async (): Promise<z.infer<typeof workbookStateSchema>> => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		const worksheets = context.workbook.worksheets.load({ name: true, position: true });
		const activeWorksheet = context.workbook.worksheets.getActiveWorksheet().load({ name: true });
		await context.sync();
		const activeSelection = await getActiveSelection();
		const worksheetsWithUsedRange = worksheets.items.map((worksheet) => ({
			worksheet,
			usedRange: worksheet.getUsedRangeOrNullObject(true).load({ address: true }),
		}));
		await context.sync();

		return {
			workbookName: workbook.name,
			activeWorksheet: activeWorksheet.name,
			activeRange: activeSelection.activeRange,
			worksheets: worksheetsWithUsedRange.map(({ worksheet, usedRange }) => ({
				name: worksheet.name,
				position: worksheet.position,
				isEmpty: usedRange.isNullObject === true,
				usedRange: usedRange.isNullObject ? null : usedRange.address,
			})),
		};
	});
};
