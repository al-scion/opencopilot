export const registerLinkedData = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		context.workbook.linkedEntityDataDomains.add({
			dataProvider: "FABRIC",
			id: "FABRIC",
			loadFunctionId: "FABRIC",
			name: "FABRIC_LOAD_SERVICE",
			supportedRefreshModes: [Excel.LinkedEntityDataDomainRefreshMode.manual],
			periodicRefreshInterval: undefined,
		});
	});
};
