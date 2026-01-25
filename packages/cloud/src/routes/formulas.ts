import {
	imageModelRegistry,
	imageModelSchema,
	languageModelRegistry,
	languageModelSchema,
} from "@packages/shared/server";
import { chat, generateImage } from "@tanstack/ai";
// import { generateImage, generateText } from "ai";
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
			const text = await chat({
				adapter: languageModelRegistry[model].adapter(),
				stream: false,
				messages: [{ role: "user", content: prompt }],
			});
			return c.json(text);
		}
	)

	.post(
		"/image",
		describeRoute({}),
		validator("json", z.object({ prompt: z.string(), model: imageModelSchema })),
		async (c) => {
			const { prompt, model } = c.req.valid("json");

			const result = await generateImage({
				adapter: imageModelRegistry[model].adapter(),
				prompt,
			});
			const fileKey = crypto.randomUUID();
			const image = result.images[0]!.b64Json!;

			await c.env.STORAGE.put(fileKey, image, {
				customMetadata: { prompt },
			});
			const origin = new URL(c.req.url).origin;
			const fileUrl = `${origin}/storage/files/${fileKey}`;
			const downloadUrl = `${origin}/storage/files/${fileKey}/download`;
			return c.json({ fileUrl, downloadUrl });
		}
	);
