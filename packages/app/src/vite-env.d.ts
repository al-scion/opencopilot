interface ImportMetaEnv {
	readonly VITE_OPENCODE_LOCAL_URL: string;
	readonly VITE_OPENCODE_CLOUD_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
