import type { CustomFunctionsConfig, ShortcutsConfig } from "@packages/shared";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { z } from "zod";
import type { Variables } from "../index";

export const officeRouter = new Hono<{ Variables: Variables }>()
	.get("/excel/shortcuts", describeRoute({}), async (c) => {
		const config: ShortcutsConfig = {
			actions: [
				{
					id: "toggleTaskpane",
					name: "toggleTaskpane",
					type: "ExecuteFunction",
				},
			],
			shortcuts: [
				{
					action: "toggleTaskpane",
					key: {
						windows: "Ctrl+J",
						mac: "Command+J",
					},
				},
			],
		};

		return c.json(config);
	})

	.get("/excel/functions", describeRoute({}), async (c) => {
		const config: CustomFunctionsConfig = {
			allowCustomDataForDataTypeAny: true,
			allowErrorForDataTypeAny: true,
			functions: [],
			enums: [],
		};

		return c.json(config);
	});
