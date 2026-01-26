import { imageModelSchema, languageModelSchema, modelRegistry } from "@packages/shared/server";
import { generateImage, generateText } from "ai";
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
				prompt: z.string(),
				model: languageModelSchema,
			})
		),
		async (c) => {
			const { prompt, model } = c.req.valid("json");
			const response = await generateText({
				model: modelRegistry.languageModel(model),
				prompt,
			});
			return c.json({ text: response.text });
		}
	)

	.post(
		"/image",
		describeRoute({}),
		validator("json", z.object({ prompt: z.string(), model: imageModelSchema })),
		async (c) => {
			const { prompt, model } = c.req.valid("json");

			const response = await generateText({
				model: modelRegistry.languageModel(model),
				prompt,
			});
			const fileKey = crypto.randomUUID();
			const { uint8Array, mediaType, base64 } = response.files[0]!;

			await c.env.STORAGE.put(fileKey, uint8Array, {
				httpMetadata: { contentType: mediaType },
				customMetadata: { prompt },
			});
			const origin = new URL(c.req.url).origin;
			const fileUrl = `${origin}/storage/files/${fileKey}`;
			const downloadUrl = `${fileUrl}?download=true`;
			return c.json({ fileUrl, downloadUrl });
		}
	);
