import { httpRouter } from "convex/server";
import { corsRouter } from "convex-helpers/server/cors";
import { httpAction } from "./_generated/server";
import { chatHandler } from "./agent/chat";

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

app.route({
	path: "/chat",
	method: "POST",
	handler: chatHandler,
});

export default app.http;
