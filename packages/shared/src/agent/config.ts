import { z } from "zod";
import { LANGUAGE_MODELS } from "./models";
import { MODES } from "./modes";

export const agentConfigSchema = z.object({
	model: z.enum(LANGUAGE_MODELS.map(({ id }) => id)),
	mode: z.enum(MODES.map(({ id }) => id)),
});
