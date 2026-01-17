import { imageModelSchema, languageModelSchema, modelRegistry } from "@packages/shared";
import { generateText } from "ai";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";
import type { Variables } from "../index";

export const formulasRouter = new Hono<{ Bindings: Env; Variables: Variables }>()
	.post(
		"/text",
		describeRoute({}),
		validator(
			"json",
			z.object({
				text: z.string(),
				model: z.string().optional(),
			})
		),
		async (c) => {
			const { text, model } = c.req.valid("json");
			const parsedModel = languageModelSchema.safeParse(model);
			const modelId = parsedModel.success ? parsedModel.data : "google/gemini-3-pro-preview";
			const response = await generateText({
				model: modelRegistry.languageModel(modelId),
				prompt: text,
				abortSignal: c.req.raw.signal,
			});
			return c.json(response.text);
		}
	)

	.post(
		"/image",
		describeRoute({}),
		validator("json", z.object({ prompt: z.string(), model: z.string().optional() })),
		async (c) => {
			const { prompt, model } = c.req.valid("json");
			const parsedModel = imageModelSchema.safeParse(model);
			const modelId = parsedModel.success ? parsedModel.data : "google/gemini-3-pro-image-preview";
			const response = await generateText({
				model: modelRegistry.languageModel(modelId),
				prompt,
				abortSignal: c.req.raw.signal,
			});
			const fileKey = crypto.randomUUID();
			const img = response.files[0]!;

			await c.env.STORAGE.put(fileKey, img.uint8Array, {
				httpMetadata: { contentType: img.mediaType },
				customMetadata: { prompt },
			});
			const origin = new URL(c.req.url).origin;
			const fileUrl = `${origin}/storage/files/${fileKey}`;
			const downloadUrl = `${origin}/storage/files/${fileKey}/download`;
			return c.json({ fileUrl, downloadUrl });
		}
	);
