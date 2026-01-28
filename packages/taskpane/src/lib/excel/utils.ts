import { tryCatch } from "../utils";

export const getActiveSelection = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const activeShape = context.workbook.getActiveShapeOrNullObject().load({ $all: true });
		const activeChart = context.workbook.getActiveChartOrNullObject().load({ $all: true });
		const { data: activeRange } = await tryCatch(async () => {
			const ranges = context.workbook.getSelectedRanges().areas.load({ address: true });
			await context.sync();
			return ranges.getItemAt(0);
		});

		return {
			activeRange: activeRange !== null ? activeRange.toJSON() : null,
			activeChart: activeChart.isNullObject ? null : activeChart.toJSON(),
			activeShape: activeShape.isNullObject ? null : activeShape.toJSON(),
		};
	});
};

export const executeCheck = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheets = context.workbook.worksheets.load();
		await context.sync();
		const ranges = worksheets.items.map((worksheet) => worksheet.getUsedRangeOrNullObject(true).load());
		await context.sync();
		const validRanges = ranges.filter((range) => range.isNullObject === false);

		// Do the check on all input cells to make sure they have dependents
		const inputRangeAreas = validRanges.flatMap((range) => {
			const constantInput = range
				.getSpecialCellsOrNullObject(Excel.SpecialCellType.constants, "LogicalNumbers")
				.load({ select: "areas/items/address, areas/items/text" });
			const formulaInput = range
				.getSpecialCellsOrNullObject(Excel.SpecialCellType.formulas, "NumbersText")
				.load({ select: "areas/items/address, areas/items/text" });
			return [constantInput, formulaInput];
		});
		await context.sync();
		const validInputRangeAreas = inputRangeAreas.filter((area) => area.isNullObject === false);
		const inputCells = validInputRangeAreas.flatMap((area) => area.areas.items);
		await context.sync();
		const results = await Promise.all(
			inputCells.map(async (cell) => {
				const { data, error } = await tryCatch(async () => {
					const dependents = cell.getDirectDependents();
					await context.sync();
					return dependents;
				});
				if (error) {
					return {
						address: cell.address,
						text: JSON.stringify(cell.text),
					};
				}
				return null;
			})
		);
		const freeFloatingCells = results.filter((result) => result !== null);
		// console.log("Input cells:", inputCells);
		// console.log("Floating inputs", freeFloatingCells);

		// const valid
		// const inputCells = worksheets.item
		// context.workbook.getSelectedRange().getSpecialCells(Excel.SpecialCellType.)
	});
};

export const checkErrorCells = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheets = context.workbook.worksheets.load();
		await context.sync();
		const ranges = worksheets.items.map((worksheet) => worksheet.getUsedRangeOrNullObject(true).load());
		await context.sync();
		const validRanges = ranges.filter((range) => range.isNullObject === false);
		const errorCellAreas = validRanges.flatMap((range) => {
			const constantInput = range
				.getSpecialCellsOrNullObject(Excel.SpecialCellType.constants, "Errors")
				.load({ select: "areas/items/address, areas/items/text, areas/items/formulas, areas/items" });
			const formulaInput = range
				.getSpecialCellsOrNullObject(Excel.SpecialCellType.formulas, "Errors")
				.load({ select: "areas/items/address, areas/items/text, areas/items/formulas, areas/items" });
			return [constantInput, formulaInput];
		});
		await context.sync();
		const validErrorCellAreas = errorCellAreas.filter((area) => area.isNullObject === false);
		const validErrorCellRanges = validErrorCellAreas.flatMap((area) => area.areas.items.map((item) => item.toJSON()));
		console.log("Found error cells:", validErrorCellRanges);
		// Then do something with the error cells
	});
};
