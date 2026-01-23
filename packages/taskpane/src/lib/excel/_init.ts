import { registerNamedRange } from "@packages/shared";
import { registerCustomFunctions, registerShortcuts } from "@/lib/excel/config";
import { useAppState } from "@/lib/state";

export const initWorkbook = async () => {
	await Office.onReady(async ({ host, platform }) => {
		// First, wait for the office to be ready and execute
		Office.addin.showAsTaskpane().then(() => useAppState.setState({ taskpaneOpen: true }));
		// Then implement shortcuts and custom functions using the Office API
		registerShortcuts();
		registerCustomFunctions();
		// All of this will stay pending until the user exits cell edit state
		await registerNamedRange();
		// Office.addin.beforeDocumentCloseNotification.enable();
		// Office.addin.beforeDocumentCloseNotification.onCloseActionCancelled(() =>
		// 	console.log("beforeDocumentCloseNotification")
		// );
	});
};
