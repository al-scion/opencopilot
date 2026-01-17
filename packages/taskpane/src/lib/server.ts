import type { AppType } from "@packages/cloud";
import { hc } from "hono/client";
import { useAppState } from "./state";

export const server = hc<AppType>(import.meta.env.VITE_SERVER_URL, {
	headers: async () => ({
		// Authorization: `Bearer ${await useAppState.getState().auth.getAccessToken()}`,
	}),
});
