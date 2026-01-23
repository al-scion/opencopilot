import { z } from "zod";

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

export const MODEL_PROVIDERS = [
	{
		id: "openai",
		name: "OpenAI",
		icon: "/assets/openai.svg",
		apiKeyPrefix: "sk-",
	},
	{
		id: "anthropic",
		name: "Anthropic",
		icon: "/assets/anthropic.svg",
		apiKeyPrefix: "sk-ant-",
	},
	{
		id: "gemini",
		name: "Gemini",
		icon: "/assets/gemini.png",
		apiKeyPrefix: "AIzaSy",
	},
	{
		id: "xai",
		name: "xAI",
		icon: "/assets/xai.svg",
		apiKeyPrefix: "xai-",
	},
];

export const IMAGE_MODELS = [
	{
		id: "google/gemini-2.5-flash-image-preview",
		name: "Gemini 2.5 Flash Image (default)",
	},
	{
		id: "google/gemini-3-pro-image-preview",
		name: "Gemini 3 Pro Image",
	},
] as const;

export type LanguageModelId = (typeof LANGUAGE_MODELS)[number]["id"];
export const languageModelSchema = z.enum(LANGUAGE_MODELS.map((m) => m.id));
export type ImageModelId = (typeof IMAGE_MODELS)[number]["id"];
export const imageModelSchema = z.enum(IMAGE_MODELS.map((m) => m.id));
