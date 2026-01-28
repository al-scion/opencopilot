import type { AppType } from "@packages/cloud";
import { hc } from "hono/client";
import { getAccessToken } from "@/lib/auth";
import { env } from "../env";

export const server = hc<AppType>(env.VITE_SERVER_URL, {
	headers: {
		Authorization: getAccessToken(),
	},
	// init: {
	// 	credentials: "include",
	// },
});
