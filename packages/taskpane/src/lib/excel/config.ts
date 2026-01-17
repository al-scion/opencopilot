import { IMAGE_MODELS, LANGUAGE_MODELS } from "@packages/shared";
import type { CustomFunctionsConfig, ShortcutsConfig } from "../types";
import { generateImage, generateText, memoize, testFunction } from "./formula";
import { testShortcut, toggleTaskpane } from "./shortcuts";

export const shortcutsDefinitions = [
	{
		id: "toggleTaskpane",
		key: {
			windows: "Ctrl+J",
			mac: "Command+J",
		},
		action: toggleTaskpane,
	},
] satisfies {
	id: string;
	key: ShortcutsConfig["shortcuts"][number]["key"];
	action: Function;
}[];

export const customFunctionsDefinitions = [
	{
		id: "GENERATE.TEXT",
		description: "Generate text with AI",
		parameters: [
			{ name: "prompt", type: "string" },
			{ name: "model", optional: true, customEnumId: "LANGUAGE_MODELS", type: "string" },
		],
		action: generateText,
	},
	{
		id: "GENERATE.IMAGE",
		description: "Generate an image with AI",
		parameters: [
			{ name: "prompt", type: "string" },
			{ name: "model", optional: true, customEnumId: "IMAGE_MODELS", type: "string" },
		],
		action: generateImage,
	},
	{
		id: "TEST",
		parameters: [],
		action: testFunction,
	},
] satisfies {
	id: string;
	description?: string;
	parameters: CustomFunctionsConfig["functions"][number]["parameters"];
	// options: CustomFunctionsConfig["functions"][number]["options"];
	// result: CustomFunctionsConfig["functions"][number]["result"];
	action: Function;
}[];

export const getCustomFunctionsConfig = (): CustomFunctionsConfig => {
	const functions = customFunctionsDefinitions.map((item) => ({
		id: item.id,
		name: item.id,
		description: item.description,
		helpUrl: "https://docs.usefabric.xyz",
		parameters: item.parameters,
		result: { dimensionality: "matrix", type: "any" },
		options: { stream: true, requiresStreamAddress: true, requiresStreamParameterAddresses: true },
	})) satisfies CustomFunctionsConfig["functions"];

	const isProd = import.meta.env.PROD;
	const customFunctions = isProd ? functions.filter((item) => item.id !== "TEST") : functions;

	return {
		allowCustomDataForDataTypeAny: true,
		allowErrorForDataTypeAny: true,
		functions: customFunctions,
		enums: [
			{
				id: "LANGUAGE_MODELS",
				type: "string",
				values: LANGUAGE_MODELS.map((item) => ({
					name: item.name,
					stringValue: item.id,
				})),
			},
			{
				id: "IMAGE_MODELS",
				type: "string",
				values: IMAGE_MODELS.map((item) => ({
					name: item.name,
					stringValue: item.id,
				})),
			},
		],
	};
};

export const getShortcutsConfig = (): ShortcutsConfig => {
	const isProd = import.meta.env.PROD;
	const shortcuts = isProd ? shortcutsDefinitions.filter((item) => item.id !== "testShortcut") : shortcutsDefinitions;

	return {
		actions: shortcuts.map((item) => ({
			id: item.id,
			name: item.id,
			type: "ExecuteFunction",
		})),
		shortcuts: shortcuts.map((item) => ({
			action: item.id,
			key: item.key,
		})),
	};
};

export const registerCustomFunctionsAndShortcuts = () => {
	// Handle registration, removing test in production environments
	const isProd = import.meta.env.PROD;
	const customFunctions = isProd
		? customFunctionsDefinitions.filter((item) => item.id !== "TEST")
		: customFunctionsDefinitions;
	const shortcuts = isProd ? shortcutsDefinitions.filter((item) => item.id !== "testShortcut") : shortcutsDefinitions;

	// Register custom functions
	CustomFunctions.associate(Object.fromEntries(customFunctions.map((item) => [item.id, memoize(item.action)])));

	// Register shortcuts
	console.log("Shortcuts to register", shortcuts);
	shortcuts.forEach((item) => {
		Office.actions.associate(item.id, item.action);
	});
	Office.actions.areShortcutsInUse(["command+j"]).then((data) => console.log("areShortcutsInUse", data));
	Office.actions.getShortcuts().then((shortcuts) => console.log("registered shortcuts", shortcuts));

	console.log("Custom functions and shortcuts registered");
};
