import type { CustomFunctionsConfig, ShortcutsConfig } from "@packages/shared";
import { IMAGE_MODELS, LANGUAGE_MODELS } from "@packages/shared";
import { generateImage, generateText, memoize } from "./formula";
import { toggleTaskpane } from "./shortcuts";

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
] satisfies {
	id: string;
	description?: string;
	parameters: CustomFunctionsConfig["functions"][number]["parameters"];
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

	return {
		allowCustomDataForDataTypeAny: true,
		allowErrorForDataTypeAny: true,
		functions,
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
	return {
		actions: shortcutsDefinitions.map((item) => ({
			id: item.id,
			name: item.id,
			type: "ExecuteFunction",
		})),
		shortcuts: shortcutsDefinitions.map((item) => ({
			action: item.id,
			key: item.key,
		})),
	};
};

export const registerCustomFunctions = () => {
	CustomFunctions.associate(
		Object.fromEntries(customFunctionsDefinitions.map((item) => [item.id, memoize(item.action)]))
	);
};

export const registerShortcuts = () => {
	shortcutsDefinitions.forEach((item) => {
		Office.actions.associate(item.id, item.action);
	});
};
