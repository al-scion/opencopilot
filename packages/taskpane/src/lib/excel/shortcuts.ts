import { useAppState } from "@/lib/state";

export const toggleTaskpane = async () => {
	const isTaskpaneOpen = useAppState.getState().taskpaneOpen;
	const isEditorFocused = useAppState.getState().editor.isFocused;

	if (!isTaskpaneOpen) {
		return Office.addin.showAsTaskpane();
	}

	if (isTaskpaneOpen && isEditorFocused) {
		return Excel.run(async ({ workbook }) => workbook.focus());
	}

	if (isTaskpaneOpen && !isEditorFocused) {
		await Office.addin.showAsTaskpane();
		useAppState.getState().editor.commands.focus("end");
		return;
	}
};
