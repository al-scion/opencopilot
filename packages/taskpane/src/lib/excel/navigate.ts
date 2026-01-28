export const focusWorksheet = async (worksheet: string) => {
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		context.workbook.worksheets.getItem(worksheet).activate();
		await context.sync();
	});
};
