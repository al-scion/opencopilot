import { z } from "zod";
import { useAppState } from "../state";
import { workbookMetadataSchema } from "./metadata";

// export const workbookStateSchema = z.object({
// 	worksheets: z.array(
// 		z.object({
// 			name: z.string(),
// 			position: z.number(),
// 		})
// 	),
// 	currentWorksheet: z.object({
// 		name: z.string(),
// 		usedRange: z.string(),
// 		selectedRange: z.string(),
// 	}),
// 	metadata: workbookMetadataSchema,
// });

export const getWorkbookState = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheets = context.workbook.worksheets.load({ name: true, position: true });
		const activeWorksheet = context.workbook.worksheets.getActiveWorksheet().load({ name: true });
		const selectedRange = context.workbook.getSelectedRange().load({ address: true });
		const activeWorksheetUsedRange = activeWorksheet.getUsedRange(true).load({ address: true });
		await context.sync();
		const metadata = useAppState.getState().workbookMetadata;

		return {
			metadata,
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

export type WorkbookState = Awaited<ReturnType<typeof getWorkbookState>>;
