import { type AnthropicChatModelProviderOptionsByName, anthropicText } from "@tanstack/ai-anthropic";
import {
	type GeminiChatModelProviderOptionsByName,
	type GeminiImageModelProviderOptionsByName,
	geminiImage,
	geminiText,
} from "@tanstack/ai-gemini";
import { type OpenAIChatModelProviderOptionsByName, openaiText } from "@tanstack/ai-openai";

export const languageModelRegistry = {
	"anthropic/claude-opus-4-5": {
		name: "Claude Opus 4.5",
		provider: "anthropic",
		adapter: () => anthropicText("claude-opus-4-5"),
		options: {} as AnthropicChatModelProviderOptionsByName["claude-opus-4-5"],
	},
	"anthropic/claude-sonnet-4-5": {
		name: "Claude Sonnet 4.5",
		provider: "anthropic",
		adapter: () => anthropicText("claude-sonnet-4-5"),
		options: {
			// thinking: { type: "enabled", budget_tokens: 2000 },
		} as AnthropicChatModelProviderOptionsByName["claude-sonnet-4-5"],
	},
	"openai/gpt-5.2": {
		name: "GPT 5.2",
		provider: "openai",
		adapter: () => openaiText("gpt-5.2"),
		options: {} as OpenAIChatModelProviderOptionsByName["gpt-5.2"],
	},
	"gemini/gemini-3-pro-preview": {
		name: "Gemini 3 Pro",
		provider: "gemini",
		adapter: () => geminiText("gemini-3-pro-preview"),
		options: {} as GeminiChatModelProviderOptionsByName["gemini-3-pro-preview"],
	},
} as const;

export const imageModelRegistry = {
	"gemini/gemini-3-pro-image-preview": {
		name: "Gemini 3 Pro",
		adapter: () => geminiImage("gemini-3-pro-image-preview"),
		options: {} as GeminiImageModelProviderOptionsByName["gemini-3-pro-image-preview"],
	},
};

export const providerRegistry = {
	anthropic: { iconUrl: "/assets/anthropic.svg", apiKeyPrefix: "sk-", name: "Anthropic" },
	openai: { iconUrl: "/assets/openai.svg", apiKeyPrefix: "sk-ant-", name: "OpenAI" },
	gemini: { iconUrl: "/assets/gemini.png", apiKeyPrefix: "AIzaSy", name: "Gemini" },
	xai: { iconUrl: "/assets/xai.svg", apiKeyPrefix: "xai-", name: "xAI" },
} as const;
