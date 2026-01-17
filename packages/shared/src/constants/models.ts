export const LANGUAGE_MODELS = [
	{
		id: "openai/gpt-5.2",
		name: "GPT 5.2",
		provider: "openai",
		icon: "/assets/openai.svg",
	},
	{
		id: "google/gemini-3-pro-preview",
		name: "Gemini 3 Pro",
		provider: "gemini",
		icon: "/assets/gemini.png",
	},
	{
		id: "anthropic/claude-opus-4-5-20251101",
		name: "Claude Opus 4.5",
		provider: "anthropic",
		icon: "/assets/anthropic.svg",
	},
	{
		id: "anthropic/claude-sonnet-4-5-20250929",
		name: "Claude Sonnet 4.5",
		provider: "anthropic",
		icon: "/assets/anthropic.svg",
	},
] as const;

export const IMAGE_MODELS = [
	{
		id: "google/gemini-2.5-flash-image",
		name: "Gemini 2.5 Flash Image (default)",
	},
	{
		id: "google/gemini-3-pro-image-preview",
		name: "Gemini 3 Pro Image",
	},
] as const;
