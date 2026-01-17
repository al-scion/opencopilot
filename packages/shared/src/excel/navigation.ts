export const handleCitation = (href: string) => {
	if (!href.startsWith("#citation:")) {
		return null;
	}
	const citation = href.split("#citation:")[1]!;
	const [sheetName, address] = citation.split("!");

	if (address && sheetName) {
		selectRange(sheetName, address);
	} else if (sheetName) {
		selectWorksheet(sheetName);
	}
};

export const selectRange = (worksheet: string, address: string) => {
	Excel.run({ delayForCellEdit: true }, async (context) => {
		context.workbook.worksheets.getItem(worksheet).getRange(address).select();
	});
};

export const selectWorksheet = (worksheet: string) => {
	Excel.run({ delayForCellEdit: true }, async (context) => {
		context.workbook.worksheets.getItem(worksheet).activate();
	});
};

export const selectChart = (worksheet: string, chart: string) => {
	Excel.run({ delayForCellEdit: true }, async (context) => {
		context.workbook.worksheets.getItem(worksheet).charts.getItem(chart).activate();
	});
};
