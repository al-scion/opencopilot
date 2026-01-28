import { z } from "zod";

const envSchema = z.object({
	VITE_OPENCODE_LOCAL_URL: z.string(),
	VITE_OPENCODE_CLOUD_URL: z.string(),
	VITE_WORKOS_CLIENT_ID: z.string(),
});

export const env = envSchema.parse(import.meta.env);
