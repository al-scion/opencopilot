import type { APIRoute } from "astro";
import { Hono } from "hono";

export const prerender = false;

const app = new Hono().basePath("/api").get("/", (c) => c.text("Hello from Hono!"));
export type App = typeof app;
const handler: APIRoute = ({ request }) => app.fetch(request);
export { handler as ALL };
