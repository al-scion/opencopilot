export const MODES = [
	{
		id: "agent",
		name: "Agent",
		description: "Edit automatically",
		writeRequired: true,
	},
	{
		id: "format",
		name: "Format",
		description: "Ask before editing",
		writeRequired: true,
	},
	{
		id: "ask",
		name: "Ask",
		description: "Plan mode",
		writeRequired: false,
	},
] as const;

export type ModeId = (typeof MODES)[number]["id"];
