interface ImportMetaEnv {
	readonly VITE_WORKOS_CLIENT_ID: string;
	readonly VITE_CONVEX_URL: string;
	readonly VITE_CONVEX_SITE_URL: string;
	readonly VITE_SERVER_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
