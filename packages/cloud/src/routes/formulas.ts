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
			const abortSignal = c.req.raw.signal;
			const handleAbort = () => {
				console.info("formulas:text request aborted");
			};
			abortSignal.addEventListener("abort", handleAbort, { once: true });
			const { prompt, model } = c.req.valid("json");

			const response = await generateText({
				model: modelRegistry.languageModel(model),
				prompt,
				abortSignal,
			});
			abortSignal.removeEventListener("abort", handleAbort);
			return c.json(response.text);
		}
	)

	.post(
		"/image",
		describeRoute({}),
		validator("json", z.object({ prompt: z.string(), model: imageModelSchema })),
		async (c) => {
			const abortSignal = c.req.raw.signal;
			const handleAbort = () => {
				console.info("formulas:image request aborted");
			};
			abortSignal.addEventListener("abort", handleAbort, { once: true });
			const { prompt, model } = c.req.valid("json");
			const response = await generateImage({
				model: modelRegistry.imageModel(model),
				prompt,
				abortSignal,
			});
			abortSignal.removeEventListener("abort", handleAbort);
			const fileKey = crypto.randomUUID();
			const img = response.image;
			const imageBytes = img.uint8Array;

			await c.env.STORAGE.put(fileKey, imageBytes, {
				httpMetadata: { contentType: img.mediaType },
				customMetadata: { prompt },
			});
			const origin = new URL(c.req.url).origin;
			const fileUrl = `${origin}/storage/files/${fileKey}`;
			const downloadUrl = `${origin}/storage/files/${fileKey}/download`;
			return c.json({ fileUrl, downloadUrl });
		}
	);
