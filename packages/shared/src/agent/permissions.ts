export const permissionsConfig = {
	edit: {
		label: "Edit automatically",
		writeRequired: true,
	},
	ask: {
		label: "Ask before editing",
		writeRequired: true,
	},
	read: {
		label: "Read only",
		writeRequired: false,
	},
} as const;
