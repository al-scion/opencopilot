import { autoFormat, registerNamedRange } from "@packages/shared";
import { useAppState } from "@/lib/state";
import { generateImage, generateText, memoize } from "./formula";
import { toggleTaskpane } from "./shortcuts";

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
			context.workbook.worksheets.onChanged.add(autoFormat);
		});

		if (import.meta.env.DEV === true) {
			await Excel.run(async (context) => {
				const worksheets = context.workbook.worksheets.load({ charts: { $all: true } });
				await context.sync();
				const charts = worksheets.items.flatMap((worksheet) => worksheet.charts.items.map((chart) => chart.toJSON()));

				console.log("range", charts);
				// console.log("shape", shape.toJSON());
				// console.log("chart", chart.toJSON());
			});
		}
	});
};
