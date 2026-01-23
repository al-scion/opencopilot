import { IMAGE_MODELS, LANGUAGE_MODELS } from "../agent/models";

// References
// WARNING: DO NOT EDIT THIS TYPE DEFINITION!!
// https://learn.microsoft.com/en-us/office/dev/add-ins/design/keyboard-shortcuts?tabs=xmlmanifest#define-custom-keyboard-shortcuts
type ShortcutsConfig = {
	actions: {
		id: string;
		name: string;
		type: "ExecuteFunction";
	}[];
	shortcuts: {
		action: string;
		key: {
			default?: string;
			windows?: string;
			mac?: string;
			web?: string;
		};
	}[];
	resources?: {
		default: {
			[key: string]: {
				value: string;
				comment?: string;
			};
		};
	};
};

// References
// WARNING: DO NOT EDIT THIS TYPE DEFINITION!!
// https://developer.microsoft.com/json-schemas/office-js/custom-functions.schema.json
// https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-json
type CustomFunctionsConfig = {
	allowCustomDataForDataTypeAny?: boolean;
	allowErrorForDataTypeAny?: boolean;
	enums?: {
		id: string;
		type: "string" | "number";
		values: {
			name: string;
			stringValue?: string;
			numberValue?: number;
			tooltip?: string;
		}[];
	}[];
	functions: {
		id: string;
		name: string;
		description?: string;
		helpUrl?: string;
		result: {
			type?: "boolean" | "number" | "string" | "any";
			dimensionality?: "scalar" | "matrix";
		};
		parameters: {
			name: string;
			description?: string;
			type?: "boolean" | "number" | "string" | "any";
			dimensionality?: "scalar" | "matrix";
			optional?: boolean;
			repeating?: boolean;
			customEnumId?: string;
			cellValueType?:
				| "cellvalue"
				| "booleancellvalue"
				| "doublecellvalue"
				| "entitycellvalue"
				| "errorcellvalue"
				| "linkedentitycellvalue"
				| "localimagecellvalue"
				| "stringcellvalue"
				| "webimagecellvalue";
		}[];
		options?: {
			stream?: boolean;
			cancelable?: boolean;
			capturesCallingObject?: boolean;
			excludeFromAutoComplete?: boolean;
			linkedEntityLoadService?: boolean;
			requiresAddress?: boolean;
			requiresParameterAddresses?: boolean;
			requiresStreamAddress?: boolean;
			requiresStreamParameterAddresses?: boolean;
			supportSync?: boolean;
			volatile?: boolean;
		};
	}[];
};

export const shortcutsDefinitions = [
	{
		id: "toggleTaskpane",
		key: {
			windows: "Ctrl+J",
			mac: "Command+J",
		},
	},
] as const satisfies {
	id: string;
	key: ShortcutsConfig["shortcuts"][number]["key"];
}[];

export type ShortcutIds = (typeof shortcutsDefinitions)[number]["id"];

export const customFunctionsDefinitions = [
	{
		id: "GENERATE.TEXT",
		description: "Generate text with AI",
		parameters: [
			{ name: "prompt", type: "string" },
			{ name: "model", optional: true, customEnumId: "LANGUAGE_MODELS", type: "string" },
		],
	},
	{
		id: "GENERATE.IMAGE",
		description: "Generate an image with AI",
		parameters: [
			{ name: "prompt", type: "string" },
			{ name: "model", optional: true, customEnumId: "IMAGE_MODELS", type: "string" },
		],
	},
] as const satisfies {
	id: string;
	description?: string;
	parameters: CustomFunctionsConfig["functions"][number]["parameters"];
}[];

export type CustomFunctionIds = (typeof customFunctionsDefinitions)[number]["id"];

export const customFunctionsConfig = {
	allowCustomDataForDataTypeAny: true,
	allowErrorForDataTypeAny: true,
	functions: customFunctionsDefinitions.map((item) => ({
		id: item.id,
		name: item.id,
		description: item.description,
		helpUrl: "https://docs.usefabric.xyz",
		parameters: item.parameters,
		result: { dimensionality: "matrix", type: "any" },
		options: { stream: true, requiresStreamAddress: true, requiresStreamParameterAddresses: true },
	})),
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

export const shortcutsConfig: ShortcutsConfig = {
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
