import { getCustomFunctionsConfig, getShortcutsConfig } from "@packages/shared/server";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import type { Variables } from "../index";

export const officeRouter = new Hono<{ Variables: Variables }>()
	.get("/excel/shortcuts", describeRoute({}), async (c) => {
		const config = getShortcutsConfig();

		return c.json(config);
	})

	.get("/excel/functions", describeRoute({}), async (c) => {
		const config = getCustomFunctionsConfig();

		return c.json(config);
	});
