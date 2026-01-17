const namedRanges = [
	{
		name: "_IS_PENDING",
		formula: "=LAMBDA(id, ISNUMBER(SEARCH(id, _PENDING_LIST)))",
		visible: false,
	},
	{
		name: "_PENDING_LIST",
		formula: `=""`,
		visible: false,
	},
];

export const registerNamedRange = () => {
	Excel.run({ delayForCellEdit: true }, async (context) => {
		const names = context.workbook.names.load({ $all: true });
		await context.sync();

		// We need to specifically set the formula and then the visible state separately
		namedRanges.forEach((item) => {
			const name =
				names.items.find((object) => object.name === item.name) ?? context.workbook.names.add(item.name, item.formula);
			name.set({ formula: item.formula });
			name.set({ visible: item.visible });
		});

		console.log("Named ranges registered");
	});
};

export const addToPendingTools = async (id: string) => {
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		const name = context.workbook.names.getItem("_PENDING_LIST").load({ value: true });
		await context.sync();
		const pendingSet = new Set<string>(name.value.split(",").filter((v: string) => v.length > 0));
		pendingSet.add(id);
		const newFormula = `="${Array.from(pendingSet).join(",")}"`;
		name.set({ formula: newFormula });
	});
};

export const removeFromPendingTools = async (id: string) => {
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		const name = context.workbook.names.getItem("_PENDING_LIST").load({ value: true });
		await context.sync();
		const pendingSet = new Set<string>(name.value.split(",").filter((v: string) => v.length > 0));
		pendingSet.delete(id);
		const newFormula = `="${Array.from(pendingSet).join(",")}"`;
		name.set({ formula: newFormula });
	});
};
