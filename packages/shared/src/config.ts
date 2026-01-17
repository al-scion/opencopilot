import { z } from "zod";
import { IMAGE_MODELS, LANGUAGE_MODELS } from "./constants/models";
import { MODES } from "./constants/modes";

export type ImageModelId = (typeof IMAGE_MODELS)[number]["id"];
export const imageModelSchema = z.enum(IMAGE_MODELS.map(({ id }) => id));
export type LanguageModelId = (typeof LANGUAGE_MODELS)[number]["id"];
export const languageModelSchema = z.enum(LANGUAGE_MODELS.map(({ id }) => id));
export type ModeId = (typeof MODES)[number]["id"];
export const modeSchema = z.enum(MODES.map(({ id }) => id));

export const agentConfigSchema = z.object({
	model: languageModelSchema,
	mode: modeSchema,
});
export type AgentConfig = z.infer<typeof agentConfigSchema>;

export const initialAgentConfig: AgentConfig = {
	model: "google/gemini-3-pro-preview",
	mode: "agent",
};
