import { z } from "zod";
import { officeMetadataSchema, workbookStateSchema } from "../excel/schema";
import type { UIMessageType } from "./message";
import { imageModelRegistry, languageModelRegistry } from "./model-registry";
import { permissionsConfig } from "./permissions";

export const imageModelSchema = z.enum(Object.keys(imageModelRegistry) as (keyof typeof imageModelRegistry)[]);
export const languageModelSchema = z.enum(Object.keys(languageModelRegistry) as (keyof typeof languageModelRegistry)[]);
export const permissionSchema = z.enum(Object.keys(permissionsConfig) as (keyof typeof permissionsConfig)[]);

export const agentConfigSchema = z.object({
	model: languageModelSchema,
	permission: permissionSchema,
});

export const chatRequestSchema = z.object({
	id: z.string(),
	messages: z.array(z.custom<UIMessageType>()),
	workbookState: workbookStateSchema,
	agentConfig: agentConfigSchema,
	officeMetadata: officeMetadataSchema,
});
