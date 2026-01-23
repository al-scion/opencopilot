import { defineAction } from "astro:actions";
import { z } from "astro/zod";
import { APPSOURCE_URL, EXCEL_DOWNLOAD_REGEX, EXCEL_URL } from "../constants";

export const server = {
	getDownloadUrl: defineAction({
		input: z.object({}),
		handler: async (input, context) => {
			const response = await fetch(EXCEL_URL, {
				headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
			});
			const html = await response.text();
			const match = html.match(EXCEL_DOWNLOAD_REGEX);
			const url = match?.[1] ?? APPSOURCE_URL;
			return { url };
		},
	}),
};
