import { $ } from "bun";

type EnvEntry = {
	key: string;
	value: string;
};

const devEnvFileUrl = new URL("../.env", import.meta.url);
const prodEnvFileUrl = new URL("../.env.production", import.meta.url);

// Parse a .env-style file into key/value pairs for sync.
const parseEnvFile = (contents: string): EnvEntry[] => {
	const entries: EnvEntry[] = [];

	for (const rawLine of contents.split("\n")) {
		const line = rawLine.trim();
		if (line.length === 0 || line.startsWith("#")) {
			continue;
		}

		const normalizedLine = line.startsWith("export ") ? line.slice(7) : line;
		const equalsIndex = normalizedLine.indexOf("=");
		if (equalsIndex === -1) {
			continue;
		}

		const key = normalizedLine.slice(0, equalsIndex).trim();
		let value = normalizedLine.slice(equalsIndex + 1).trim();

		if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1);
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1);
		}

		if (key.length === 0) {
			continue;
		}

		entries.push({ key, value });
	}

	return entries;
};

// Parse the convex env list output into a list of keys.
const parseEnvList = (contents: string): string[] => {
	const keys: string[] = [];

	for (const rawLine of contents.split("\n")) {
		const line = rawLine.trim();
		if (line.length === 0) {
			continue;
		}

		const equalsIndex = line.indexOf("=");
		if (equalsIndex > 0) {
			keys.push(line.slice(0, equalsIndex).trim());
			continue;
		}

		const [firstToken] = line.split(/\s+/);
		if (firstToken) {
			keys.push(firstToken);
		}
	}

	return keys;
};

const readEnvFile = async (fileUrl: URL): Promise<EnvEntry[]> => {
	const file = Bun.file(fileUrl);
	if (!(await file.exists())) {
		throw new Error(`Env file not found: ${file.name}`);
	}

	const contents = await file.text();
	return parseEnvFile(contents);
};

const syncEntries = async (entries: EnvEntry[], commandArgs: string[]): Promise<void> => {
	// Remove any remote keys that are no longer present locally.
	const listOutput = await $`bun convex env list ${commandArgs}`.text();
	const existingKeys = parseEnvList(listOutput);
	const desiredKeys = new Set(entries.map((entry) => entry.key));

	for (const key of existingKeys) {
		if (!desiredKeys.has(key)) {
			await $`bun convex env remove ${commandArgs} ${key}`;
		}
	}

	// Upsert the current values from the local file sequentially to avoid OCC conflicts.
	for (const { key, value } of entries) {
		await $`bun convex env set ${commandArgs} ${key} ${value}`;
	}
};

// Flags: --prod (prod only), --all (dev + prod), default (dev only).
const args = Bun.argv.slice(2);
const shouldRunAll = args.includes("--all");
const shouldRunProdOnly = args.includes("--prod");

if (shouldRunAll) {
	const devEntries = await readEnvFile(devEnvFileUrl);
	const prodEntries = await readEnvFile(prodEnvFileUrl);
	await syncEntries(devEntries, []);
	await syncEntries(prodEntries, ["--prod"]);

} else if (shouldRunProdOnly) {
	const prodEntries = await readEnvFile(prodEnvFileUrl);
	await syncEntries(prodEntries, ["--prod"]);
} else {
	const devEntries = await readEnvFile(devEnvFileUrl);
	await syncEntries(devEntries, []);
}
