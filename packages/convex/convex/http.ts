import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { httpAction } from "./_generated/server";

const http = httpRouter();
const app = corsRouter(http, {
	allowedOrigins: ["*"],
	allowedHeaders: ["*"],
	// debug: true,
});

app.route({
	path: "/health",
	method: "GET",
	handler: httpAction(async (ctx, req) => {
		return new Response("ok");
	}),
});

export default app.http;
