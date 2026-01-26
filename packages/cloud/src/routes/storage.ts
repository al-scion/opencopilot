import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";
import type { Variables } from "../index";

export const storageRouter = new Hono<{ Bindings: Env; Variables: Variables }>()
	.post(
		"/upload",
		describeRoute({}),
		validator(
			"form",
			z.object({
				file: z.file(),
				key: z.string().optional(),
			})
		),
		async (c) => {
			const { file, key } = c.req.valid("form");
			const fileKey = key || crypto.randomUUID();
			await c.env.STORAGE.put(fileKey, file, {
				httpMetadata: { contentType: file.type },
				customMetadata: { name: file.name },
			});
			const origin = new URL(c.req.url).origin;
			const fileUrl = `${origin}/storage/files/${fileKey}`;
			const downloadUrl = `${fileUrl}?download=true`;
			return c.json({ fileUrl, downloadUrl });
		}
	)

	.get(
		"/files/:key",
		describeRoute({}),
		validator("query", z.object({ download: z.boolean().optional() })),
		async (c) => {
			const key = c.req.param("key");
			const { download } = c.req.valid("query");
			const file = await c.env.STORAGE.get(key)!;
			if (!file) {
				return c.notFound();
			}
			c.header("Content-Type", file.httpMetadata?.contentType);
			download && c.header("Content-Disposition", `attachment; filename="${file.customMetadata?.name || "download"}"`);
			return c.body(file.body);
		}
	);
