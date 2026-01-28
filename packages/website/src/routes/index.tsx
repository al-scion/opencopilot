import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Header } from "@/components/header";
import { MainSection } from "@/components/main";
import { APPSOURCE_URL, EXCEL_DOWNLOAD_REGEX, EXCEL_URL, EXCEL_WEB_REGEX, EXCEL_WEB_URL } from "../lib/constants";

export const Route = createFileRoute("/")({
	component: RouteComponent,
	loader: async () => {
		const downloadUrl = await getDownloadUrl();
		const webUrl = await getExcelWebUrl();
		return { downloadUrl, webUrl };
	},
	headers: () => ({
		"Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
	}),
});

const getDownloadUrl = createServerFn({
	method: "GET",
}).handler(async () => {
	const response = await fetch(EXCEL_URL, {
		headers: {
			"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
		},
	});
	const html = await response.text();
	const match = html.match(EXCEL_DOWNLOAD_REGEX);
	const url = match?.[1] ?? APPSOURCE_URL;
	return url;
});

const getExcelWebUrl = createServerFn({
	method: "GET",
}).handler(async () => {
	const response = await fetch(EXCEL_WEB_URL);
	const html = await response.text();
	const match = html.match(EXCEL_WEB_REGEX);
	const url = match?.[1] ?? APPSOURCE_URL;
	return url;
});

function RouteComponent() {
	const { downloadUrl, webUrl } = Route.useLoaderData();

	return (
		<>
			<Header excelUrl={downloadUrl} />
			{/* <MainSection /> */}
		</>
	);
}
