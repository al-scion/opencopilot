import { autoFormat, registerNamedRange } from "@packages/shared";
import { useAppState } from "@/lib/state";
import { generateImage, generateText, memoize } from "./formula";
import { toggleTaskpane } from "./shortcuts";
import { checkErrorCells, executeCheck } from "./utils";

export const initWorkbook = async () => {
	await Office.onReady(async ({ host, platform }) => {
		// First, wait for the office to be ready and execute
		await Office.addin.showAsTaskpane().then(() => useAppState.setState({ taskpaneOpen: true }));

		// Then implement shortcuts and custom functions using the Office API
		CustomFunctions.associate({
			"GENERATE.TEXT": memoize(generateText),
			"GENERATE.IMAGE": memoize(generateImage),
		});
		Office.actions.associate("toggleTaskpane", toggleTaskpane);

		// All of this will stay pending until the user exits cell edit state
		await registerNamedRange();

		await Excel.run({ delayForCellEdit: true }, async (context) => {
			context.workbook.worksheets.onChanged.remove(autoFormat);
			context.workbook.worksheets.onChanged.add(autoFormat);
			// handler.
			// context.workbook.worksheets.onCalculated.add(async (e) => console.log(e));
		});

		if (import.meta.env.DEV === true) {
			await Excel.run({ delayForCellEdit: true }, async (context) => {
				const startTime = performance.now();
				await checkErrorCells();
				// await executeCheck();
				const endTime = performance.now();
				console.log(`executeCheck took ${(endTime - startTime).toFixed(2)}ms`);
			});
		}
	});
};
