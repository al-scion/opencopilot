import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { describeRoute, openAPIRouteHandler, validator } from "hono-openapi";
import { z } from "zod";

export type Variables = {};

const app = new Hono<{ Variables: Variables; Bindings: Env }>()
	.use(cors())
	.use(logger())
	.use(prettyJSON({ force: true }))
	.get("/tls", describeRoute({}), (c) => {
		const key: string = c.env.TLS_KEY;
		const cert: string = c.env.TLS_CERT;
		const host: string = c.env.TLS_HOST;
		return c.json({ key, cert, host });
	});

app.get("/openapi", openAPIRouteHandler(app));
app.get("/docs", Scalar({ url: "/openapi" }));

export default app;
