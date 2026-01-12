import { createFileRoute, Outlet } from "@tanstack/react-router";
import { initWorkbook } from "@/lib/excel/_init";

export const Route = createFileRoute("/taskpane")({
	component: Outlet,
	beforeLoad: async ({ context }) => {
		await initWorkbook();
	},
});
