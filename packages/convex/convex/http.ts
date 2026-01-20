import { type HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { type ActionCtx, httpAction } from "./_generated/server";

const app = new Hono<{ Bindings: ActionCtx }>();
app.use(cors());
app.get("/", async (c) => {
	c.text("Hello from Convex with Hono!");
});

export default new HttpRouterWithHono(app);
