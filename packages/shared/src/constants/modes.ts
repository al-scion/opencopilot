export const MODES = [
	{
		id: "agent",
		name: "Agent",
		description: "Automatically plan and execute tasks",
		writeRequired: true,
	},
	{
		id: "format",
		name: "Format",
		description: "Format the data in the workbook",
		writeRequired: true,
	},
	{
		id: "ask",
		name: "Ask",
		description: "Ask a question to the agent",
		writeRequired: false,
	},
] as const;
