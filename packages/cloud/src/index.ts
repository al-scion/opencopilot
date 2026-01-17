/// <reference path="../worker-configuration.d.ts" />

import { Scalar } from "@scalar/hono-api-reference";
import { ConvexHttpClient } from "convex/browser";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import type { JWTPayload } from "hono/utils/jwt/types";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";
import { chatRouter } from "./routes/chat";
import { formulasRouter } from "./routes/formulas";
import { officeRouter } from "./routes/office";
import { storageRouter } from "./routes/storage";

export type Variables = {
	jwtPayload: JWTPayload & { sub: string };
	convex: ConvexHttpClient;
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>()
	.use(cors({ origin: "*" }))
	.use(logger())
	.use(prettyJSON({ force: true }))
	.use(async (c, next) => {
		c.set("convex", new ConvexHttpClient(c.env.CONVEX_URL));
		await next();
	})
	.get("/health", describeRoute({}), (c) => c.json({ status: "OK" }))
	.get("/", (c) => c.redirect("/docs"))
	.route("/storage", storageRouter)
	.route("/chat", chatRouter)
	.route("/office", officeRouter)
	.route("/formulas", formulasRouter);

app.get("/openapi", openAPIRouteHandler(app));
app.get("/docs", Scalar({ url: "/openapi" }));

export type AppType = typeof app;
export default app;
