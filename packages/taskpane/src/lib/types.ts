export type MentionItem = {
	id: string;
	label: string;
	icon: React.ElementType;
	menuLabel: string;
	menuSubLabel: string;
};

// References
// WARNING: DO NOT EDIT THIS TYPE DEFINITION!!
// https://developer.microsoft.com/json-schemas/office-js/custom-functions.schema.json
// https://learn.microsoft.com/en-us/office/dev/add-ins/excel/custom-functions-json
export type CustomFunctionsConfig = {
	allowCustomDataForDataTypeAny?: boolean;
	allowErrorForDataTypeAny?: boolean;
	enums?: Array<{
		id: string;
		type: "string" | "number";
		values: Array<{
			name: string;
			stringValue?: string;
			numberValue?: number;
			tooltip?: string;
		}>;
	}>;
	functions: Array<{
		id: string;
		name: string;
		description?: string;
		helpUrl?: string;
		result: {
			type?: "boolean" | "number" | "string" | "any";
			dimensionality?: "scalar" | "matrix";
		};
		parameters: Array<{
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
		}>;
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
	}>;
};

// References
// WARNING: DO NOT EDIT THIS TYPE DEFINITION!!
// https://learn.microsoft.com/en-us/office/dev/add-ins/design/keyboard-shortcuts?tabs=xmlmanifest#define-custom-keyboard-shortcuts
export type ShortcutsConfig = {
	actions: Array<{
		id: string;
		name: string;
		type: "ExecuteFunction";
	}>;
	shortcuts: Array<{
		action: string;
		key: {
			default?: string;
			windows?: string;
			mac?: string;
			web?: string;
		};
	}>;
	resources?: {
		default: {
			[key: string]: {
				value: string;
				comment?: string;
			};
		};
	};
};
