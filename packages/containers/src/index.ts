import { Container, getContainer, getRandom } from "@cloudflare/containers";
import { Hono } from "hono";

export class OpencodeContainer extends Container<Env> {
	override defaultPort = 4096;
	override requiredPorts = [4096];
	override envVars = {
		ANTHROPIC_API_KEY: this.env.ANTHROPIC_API_KEY,
		OPENAI_API_KEY: this.env.OPENAI_API_KEY,
		// OPENCODE_SERVER_PASSWORD: "public",
	};
}

const app = new Hono<{ Bindings: Env }>();

app.get("/warm/:id", async (c) => {
	const start = Date.now();
	const id = c.req.param("id");
	const container = c.env.OpencodeContainer.getByName(id);
	await container.startAndWaitForPorts();
	const duration = `${Date.now() - start}ms`;
	return c.json({ duration });
});

app.all("/container/:id/*", async (c) => {
	const id = c.req.param("id");
	const container = c.env.OpencodeContainer.getByName(id);
	const url = new URL(c.req.url);
	url.pathname = url.pathname.replace(`/container/${id}`, "");
	const request = new Request(url, c.req.raw);
	return container.fetch(request);
});

export default (<ExportedHandler<Env>>{
	fetch: app.fetch,
});
