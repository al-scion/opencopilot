import type { AppType } from "@packages/cloud";
import { hc } from "hono/client";
import { getAccessToken } from "@/lib/auth";

export const server = hc<AppType>(import.meta.env.VITE_SERVER_URL, {
	headers: {
		Authorization: getAccessToken(),
	},
	// init: {
	// 	credentials: "include",
	// },
});
