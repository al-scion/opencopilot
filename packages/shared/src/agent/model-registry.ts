import { type AnthropicProviderOptions, anthropic } from "@ai-sdk/anthropic";
import {
	type GoogleGenerativeAIImageProviderOptions,
	type GoogleGenerativeAIProviderOptions,
	google,
} from "@ai-sdk/google";
import { type OpenAIResponsesProviderOptions, openai } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";

export const modelRegistry = createProviderRegistry(
	{
		anthropic,
		openai,
		google,
	},
	{
		separator: "/",
	}
);

export const languageModelRegistry = {
	"google/gemini-3-pro-preview": {
		name: "Gemini 3 Pro",
		provider: "google",
		contextWindow: 1_048_576,
		options: {
			thinkingConfig: { includeThoughts: true, thinkingLevel: "low" },
		} as GoogleGenerativeAIProviderOptions,
	},
	"openai/gpt-5.2": {
		name: "GPT 5.2",
		provider: "openai",
		contextWindow: 400_000,
		options: {
			reasoningEffort: "medium",
			reasoningSummary: "detailed",
		} as OpenAIResponsesProviderOptions,
	},
	"anthropic/claude-sonnet-4-5": {
		name: "Claude Sonnet 4.5",
		provider: "anthropic",
		contextWindow: 1_000_000,
		options: {
			thinking: { type: "enabled", budgetTokens: 4000 },
			sendReasoning: true,
		} as AnthropicProviderOptions,
	},
	"anthropic/claude-opus-4-5": {
		name: "Claude Opus 4.5",
		provider: "anthropic",
		contextWindow: 200_000,
		options: {
			effort: "medium",
			sendReasoning: true,
		} as AnthropicProviderOptions,
	},
} as const;

export const imageModelRegistry = {
	"google/gemini-3-pro-image-preview": {
		name: "Gemini 3 Pro Image",
		provider: "google",
		options: {},
	},
	"google/gemini-2.5-flash-image-preview": {
		name: "Gemini 2.5 Flash Image",
		provider: "google",
		options: {},
	},
} as const;

export const providerRegistry = {
	google: {
		iconUrl: "/assets/gemini.png",
		apiKeyPrefix: "AIzaSy",
		name: "Gemini",
	},
	anthropic: {
		name: "Anthropic",
		iconUrl: "/assets/anthropic.svg",
		apiKeyPrefix: "sk-",
	},
	openai: {
		name: "OpenAI",
		iconUrl: "/assets/openai.svg",
		apiKeyPrefix: "sk-ant-",
	},
} as const;
