import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { describeRoute, openAPIRouteHandler } from "hono-openapi";

export type Variables = {};

const app = new Hono<{ Variables: Variables; Bindings: Env }>()
	.use(cors())
	.use(logger())
	.use(prettyJSON({ force: true }));

export default app;
