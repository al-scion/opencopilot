import type { AppType } from "@packages/core";
import { hc } from "hono/client";
import { env } from "@/lib/env";
import { useAppState } from "./state";

export const server = hc<AppType>(env.VITE_SERVER_URL, {
	headers: async () => ({
		// Authorization: `Bearer ${await useAppState.getState().auth.getAccessToken()}`,
	}),
});

// export const uploadImage = async (base64String: string) => {
// 	const url = `data:image/png;base64,${base64String}`;
// 	const res = await fetch(url);
// 	const blob = await res.blob();
// 	const file = new File([blob], "image.png", { type: "image/png" });
// 	const upload = await server.storage.upload.$post({ form: { file } });
// 	const data = await upload.json();
// 	return data.url;
// };
