import { useAppState } from "@/lib/state";

export const toggleTaskpane = async () => {
	const { taskpaneOpen, editor } = useAppState.getState();

	if (!taskpaneOpen) {
		return Office.addin.showAsTaskpane();
	}

	if (taskpaneOpen && editor.isFocused) {
		return Excel.run(async ({ workbook }) => workbook.focus());
	}

	if (taskpaneOpen && !editor.isFocused) {
		Office.addin.showAsTaskpane();
		useAppState.getState().editor.commands.focus("end");
		return;
	}
};
