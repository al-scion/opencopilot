import { registerNamedRange } from "@packages/shared";
import { registerCustomFunctions, registerShortcuts } from "@/lib/excel/config";
import { registerEvents } from "@/lib/excel/events";
import { useAppState } from "@/lib/state";

export const initWorkbook = async () => {
	await Office.onReady(async ({ host, platform }) => {
		// First, wait for the office to be ready and execute
		Office.addin.showAsTaskpane().then(() => useAppState.setState({ taskpaneOpen: true }));

		registerShortcuts();
		registerCustomFunctions();

		// All of this will stay pending until the user exits cell edit state
		await Excel.run({ delayForCellEdit: true }, async (context) => {
			const workbook = context.workbook.load({ name: true });
			const worksheets = context.workbook.worksheets.load({ $all: true });
			const activeRange = context.workbook.getSelectedRange().load({ address: true });
			await context.sync();
			useAppState.getState().setWorkbookState({
				worksheets: worksheets.items,
				activeRange,
				workbook,
			});

			await Promise.all([registerNamedRange(), registerEvents()]);
		});
	});
};
