import { randomUUID } from "node:crypto";
import { mkdir, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { $ } from "bun";
import {
	copyBinaryToSidecarFolder,
	getCurrentSidecar,
	getSidecarDestination,
	isWindowsTarget,
} from "./utils";

const target = Bun.env.TAURI_ENV_TARGET_TRIPLE ?? Bun.env.RUST_TARGET;
const version = Bun.env.OPENCODE_VERSION?.replace(/^v/, "");

if (!target) {
	throw new Error("TAURI_ENV_TARGET_TRIPLE is not set");
}

const sidecarPath = getSidecarDestination(target);
const existingBinary = await stat(sidecarPath).catch(() => null);
if (existingBinary) {
	console.log(`Sidecar already exists at ${sidecarPath}`);
} else {
	const sidecarConfig = getCurrentSidecar(target);
	const assetName = `${sidecarConfig.ocBinary}.${sidecarConfig.assetExt}`;
	const downloadBase = version
		? `https://github.com/anomalyco/opencode/releases/download/v${version}`
		: "https://github.com/anomalyco/opencode/releases/latest/download";
	const downloadUrl = `${downloadBase}/${assetName}`;

	const tempRoot = join(tmpdir(), `opencode-${randomUUID()}`);
	await mkdir(tempRoot, { recursive: true });

	const archivePath = join(tempRoot, assetName);

	try {
		await $`curl -fsSL ${downloadUrl} -o ${archivePath}`;

		if (sidecarConfig.assetExt === "zip") {
			try {
				await $`unzip -q ${archivePath} -d ${tempRoot}`;
			} catch (error) {
				if (process.platform !== "win32") {
					throw error;
				}
				await $`tar -xf ${archivePath} -C ${tempRoot}`;
			}
		} else {
			await $`tar -xzf ${archivePath} -C ${tempRoot}`;
		}

		const binaryName = isWindowsTarget(target) ? "opencode.exe" : "opencode";
		const binaryPath = join(tempRoot, binaryName);
		await stat(binaryPath);

		await copyBinaryToSidecarFolder(binaryPath, target);
	} finally {
		await rm(tempRoot, { recursive: true, force: true }).catch(() => undefined);
	}
}
