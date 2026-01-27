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
			context.workbook.worksheets.onCalculated.add(async (e) => console.log(e));
		});

		if (import.meta.env.DEV === true) {
			await Excel.run(async (context) => {
				const worksheets = context.workbook.worksheets.load();
				await context.sync();
				const results = worksheets.items.map((worksheet) =>
					worksheet.findAllOrNullObject("hello", {}).areas.load({ address: true, formulas: true, text: true })
				);
				await context.sync();
				const validResults = results.filter((result) => result.isNullObject === false);
				const validResultsJson = validResults.map((result) => result.toJSON());
				console.log(validResultsJson);

				// const data = results.flatMap((collection) => collection.items.map((area) => area.toJSON()));
				// console.log(data);
				// const cf = range.conditionalFormats.add(Excel.ConditionalFormatType.custom).set({
				// 	custom: {
				// 		rule: { formula: "=TRUE" },
				// 		format: { fill: { color: "red" } },
				// 	},
				// });
				// range.load({ expand: "conditionalFormats/custom/rule, conditionalFormats/custom/format" });
				// await context.sync();
				// console.log(range.conditionalFormats.items.map((cf) => cf.toJSON()));
			});
		}
	});
};
