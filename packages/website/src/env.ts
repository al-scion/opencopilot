import { z } from "zod";

const serverEnvSchema = z.object({});

const clientEnvSchema = z.object({
	VITE_WEB_EXTENSION_ID: z.string(),
	VITE_WORKOS_CLIENT_ID: z.string(),
});

export const clientEnv = clientEnvSchema.parse(import.meta.env);
// export const serverEnv = serverEnvSchema.parse(process.env);
