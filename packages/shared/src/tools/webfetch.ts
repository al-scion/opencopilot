import type { InferUITool, InferUITools } from "ai";
import { tool } from "ai";
import Exa from "exa-js";
import { z } from "zod";

const exa = new Exa();

export const webFetch = tool({
	description: "Fetches content from a specified URL",
	inputSchema: z.object({
		urls: z.array(z.string()),
	}),
	execute: async (input, opts) => {
		const data = await exa.getContents(input.urls, { text: true });
		const results = data.results.map((result) => ({
			text: result.text,
			title: result.title,
			url: result.url,
			date: result.publishedDate,
		}));
		return results;
	},
});

export const webSearch = tool({
	description: "Use a search engine to find information on the web",
	inputSchema: z.object({
		query: z.string(),
	}),
	execute: async (input, opts) => {
		const data = await exa.search(input.query);
		const results = data.results.map((result) => ({
			title: result.title,
			url: result.url,
			text: result.text,
			date: result.publishedDate,
		}));
		return results;
	},
});

export const webFetchTools = {
	webFetch,
	webSearch,
};

export type WebFetchTools = InferUITools<typeof webFetchTools>;
