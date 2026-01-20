import type { CustomFunctionIds, ShortcutIds } from "@packages/shared";
import { generateImage, generateText, memoize } from "./formula";
import { toggleTaskpane } from "./shortcuts";

export const registerCustomFunctions = () => {
	CustomFunctions.associate({
		"GENERATE.TEXT": memoize(generateText),
		"GENERATE.IMAGE": memoize(generateImage),
	});
};

export const registerShortcuts = () => {
	Office.actions.associate("toggleTaskpane", toggleTaskpane);
};
