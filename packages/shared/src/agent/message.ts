import type { FinishReason, LanguageModelUsage, UIMessage } from "ai";
import { z } from "zod";
import { workbookStateSchema } from "../excel/workbook-state";
import { agentConfigSchema } from "./config";
import type { ToolDefinitions } from "./tool-registry";

const metadataSchema = z
	.object({
		startTime: z.number().optional(),
		endTime: z.number().optional(),
		finishReason: z.custom<FinishReason>().optional(),
		model: z.string().optional(),
		usage: z.custom<LanguageModelUsage>().optional(),
		tiptap: z.any().optional(),
		checkpointId: z.string().optional(),
	})
	.catchall(z.unknown());

const dataPartSchema = z.object({});

type Metadata = z.infer<typeof metadataSchema>;
type DataPart = z.infer<typeof dataPartSchema>;
export type MessageType = UIMessage<Metadata, DataPart, ToolDefinitions>;

export const messageRequestSchema = z.object({
	id: z.string(),
	messages: z.array(z.custom<MessageType>()),
	workbook: workbookStateSchema,
	agentConfig: agentConfigSchema,
});
