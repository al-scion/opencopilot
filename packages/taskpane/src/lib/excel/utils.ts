export const getActiveSelection = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const activeShape = context.workbook.getActiveShapeOrNullObject().load({ $all: true });
		const activeChart = context.workbook.getActiveChartOrNullObject().load({ $all: true });
		await context.sync();

		if (activeChart.isNullObject === false) {
			return {
				type: "chart",
				activeSelection: activeChart,
			} as const;
		}

		if (activeShape.isNullObject === false) {
			return {
				type: "shape",
				activeSelection: activeShape,
			} as const;
		}

		const selectedRange = context.workbook.getSelectedRanges().areas.getItemAt(0).load({ address: true });
		await context.sync();
		return {
			type: "range",
			activeSelection: selectedRange,
		} as const;
	});
};
