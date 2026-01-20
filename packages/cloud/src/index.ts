/// <reference path="../worker-configuration.d.ts" />

import { Scalar } from "@scalar/hono-api-reference";
import { ConvexHttpClient } from "convex/browser";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwk } from "hono/jwk";
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
	// .use(jwk({ jwks_uri: `https://api.workos.com/sso/jwks/${process.env.WORKOS_CLIENT_ID}`, alg: ["RS256"] }))
	.use(async (c, next) => {
		const ipAddress = c.req.header("x-real-ip") || c.req.header("cf-connecting-ip") || "";

		const auth = c.req.header("Authorization")?.split(" ")[1];
		c.set("convex", new ConvexHttpClient(c.env.CONVEX_URL, { auth }));
		await next();
	})
	.get("/health", describeRoute({}), (c) => c.json({ status: "OK" }))
	.route("/storage", storageRouter)
	.route("/chat", chatRouter)
	.route("/office", officeRouter)
	.route("/formulas", formulasRouter);

app.get("/", (c) => c.redirect("/docs"));
app.get("/openapi", openAPIRouteHandler(app));
app.get("/docs", Scalar({ url: "/openapi" }));

export type AppType = typeof app;
export default app;
