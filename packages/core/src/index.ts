import { createOpencode, createOpencodeClient, createOpencodeServer } from "@opencode-ai/sdk";

export const { server } = await createOpencode({
	hostname: "127.0.0.1",
	port: 0,
	config: {},
});

console.log(server.url);
