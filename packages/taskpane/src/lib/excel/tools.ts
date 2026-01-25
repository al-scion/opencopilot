import { editRangeDef, jsonToMarkdownTable } from "@packages/shared";

export const editRangeClient = editRangeDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
		range.set({ values: input.values });
		range.load({ text: true });
		await context.sync();
		return jsonToMarkdownTable(range.text);
	});
	return { result };
});
