import type { AppType } from "@packages/cloud";
import type { useAuth } from "@workos-inc/authkit-react";
import { hc } from "hono/client";
import { getAccessToken } from "@/lib/auth";

export const server = hc<AppType>(import.meta.env.VITE_SERVER_URL, {
	headers: async () => ({
		Authorization: await getAccessToken(),
	}),
});

// export const useServer = (auth: ReturnType<typeof useAuth>) => {
// 	const server = hc<AppType>(import.meta.env.VITE_SERVER_URL, {
// 		headers: async () => ({
// 			Authorization: await auth.getAccessToken(),
// 		}),
// 	});
// 	return server;
// };
