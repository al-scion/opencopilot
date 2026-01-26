import type { FinishReason, InferUITools, LanguageModelUsage, UIMessage } from "ai";
import { z } from "zod";
import type { excelTools } from "../excel/tools";

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
type ToolType = InferUITools<typeof excelTools>;

type Metadata = z.infer<typeof metadataSchema>;
type DataPart = z.infer<typeof dataPartSchema>;
export type UIMessageType = UIMessage<Metadata, DataPart, ToolType>;
