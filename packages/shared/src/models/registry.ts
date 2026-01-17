import { type AnthropicProviderOptions, anthropic } from "@ai-sdk/anthropic";
import { type GoogleGenerativeAIProviderOptions, google } from "@ai-sdk/google";
import { type OpenAIResponsesProviderOptions, openai } from "@ai-sdk/openai";
import { createProviderRegistry } from "ai";

export const modelRegistry = createProviderRegistry(
	{
		openai,
		anthropic,
		google,
	},
	{ separator: "/" }
);

export type ProviderOptions = {
	google?: GoogleGenerativeAIProviderOptions;
	openai?: OpenAIResponsesProviderOptions;
	anthropic?: AnthropicProviderOptions;
};

export const defaultProviderOptions: ProviderOptions = {
	google: {
		thinkingConfig: { includeThoughts: true },
		imageConfig: {},
	},
	anthropic: {
		sendReasoning: true,
	},
	openai: {
		reasoningEffort: "medium",
		reasoningSummary: "auto",
	},
};

export type ModelId = Parameters<typeof modelRegistry.languageModel>[0];
