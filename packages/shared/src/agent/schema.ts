import { z } from "zod";
import { workbookStateSchema } from "../excel/schema";
import { imageModelRegistry, languageModelRegistry } from "./model-registry";
import { MODES } from "./modes";

export const imageModelSchema = z.enum(Object.keys(imageModelRegistry) as (keyof typeof imageModelRegistry)[]);
export const languageModelSchema = z.enum(Object.keys(languageModelRegistry) as (keyof typeof languageModelRegistry)[]);

export const agentConfigSchema = z.object({
	model: languageModelSchema,
	mode: z.enum(MODES.map(({ id }) => id)),
});

export const chatRequestSchema = z.object({
	data: z.object({ conversationId: z.string() }),
	messages: z.array(z.any()),
	workbookState: workbookStateSchema,
	agentConfig: agentConfigSchema,
});
