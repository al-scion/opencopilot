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
			const downloadUrl = `${origin}/storage/files/${fileKey}/download`;
			return c.json({ fileUrl, downloadUrl });
		}
	)

	.get("/files/:key", describeRoute({}), async (c) => {
		const key = c.req.param("key");
		const file = await c.env.STORAGE.get(key);
		if (!file) {
			return c.notFound();
		}
		return c.body(file.body, 200, { "content-type": file.httpMetadata?.contentType ?? "" });
	})

	.get("/files/:key/download", describeRoute({}), async (c) => {
		const key = c.req.param("key");
		const file = await c.env.STORAGE.get(key);
		if (!file) {
			return c.notFound();
		}
		const filename = file.customMetadata?.name || "download";
		const headers = {
			"content-type": file.httpMetadata?.contentType ?? "",
			"content-disposition": `attachment; filename="${filename}"`,
		};
		return c.body(file.body, 200, headers);
	});
