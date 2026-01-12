import { getWorkbookAsFile } from "@/lib/excel/checkpoint";
import { addToPendingTools } from "@/lib/excel/conditional-format";
import { jsonToMarkdownTable } from "@/lib/excel/markdown";
import { server } from "@/lib/server";
import { useAppState } from "@/lib/state";

export const toggleTaskpane = async () => {
	const isTaskpaneOpen = useAppState.getState().taskpaneOpen;
	const isEditorFocused = useAppState.getState().editor.isFocused;
	console.log(`isTaskpaneOpen: ${isTaskpaneOpen}, isEditorFocused: ${isEditorFocused}`);

	if (!isTaskpaneOpen) {
		await Office.addin.showAsTaskpane();
		return;
	}

	if (isTaskpaneOpen && isEditorFocused) {
		// await Office.addin.hide();
		await Excel.run(async ({ workbook }) => workbook.focus());
		return;
	}

	if (isTaskpaneOpen && !isEditorFocused) {
		await Office.addin.showAsTaskpane();
		useAppState.getState().editor.commands.focus("end");
		return;
	}
};

export const testShortcut = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const range = context.workbook
			.getSelectedRange()
			.load({ numberFormatCategories: true, values: true, valueTypes: true, numberFormat: true, valuesAsJson: true });
		await context.sync();
		console.log("range", range.toJSON());
	});
};
