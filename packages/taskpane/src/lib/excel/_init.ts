import { registerNamedRange } from "@packages/shared";
// import { registerCustomFunctions, registerShortcuts } from "@/lib/excel/config";
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
	});
};
