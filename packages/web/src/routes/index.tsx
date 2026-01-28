import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { APPSOURCE_URL, EXCEL_DOWNLOAD_REGEX, EXCEL_URL } from "../lib/constants";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: () => {
		const url = getDownloadUrl();
		return url;
	},
	headers: () => ({
		// Cache at CDN for 1 hour, allow stale content for up to 1 day
		"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
	}),
});

const getDownloadUrl = createServerFn({
	method: "GET",
}).handler(async (c) => {
	const response = await fetch(EXCEL_URL, {
		headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" },
	});
	const html = await response.text();
	const match = html.match(EXCEL_DOWNLOAD_REGEX);
	const url = match?.[1] ?? APPSOURCE_URL;
	return { url };
});

function RouteComponent() {
	const { url } = Route.useLoaderData();
	return <div>Hello "/" ! {url} </div>;
}
