import { chmod, mkdir } from "node:fs/promises";
import { join, resolve } from "node:path";

export const SIDECAR_BINARIES = [
	{
		rustTarget: "aarch64-apple-darwin",
		ocBinary: "opencode-darwin-arm64",
		assetExt: "zip",
	},
	{
		rustTarget: "x86_64-apple-darwin",
		ocBinary: "opencode-darwin-x64",
		assetExt: "zip",
	},
	{
		rustTarget: "x86_64-pc-windows-msvc",
		ocBinary: "opencode-windows-x64",
		assetExt: "zip",
	},
	{
		rustTarget: "x86_64-unknown-linux-gnu",
		ocBinary: "opencode-linux-x64",
		assetExt: "tar.gz",
	},
	{
		rustTarget: "aarch64-unknown-linux-gnu",
		ocBinary: "opencode-linux-arm64",
		assetExt: "tar.gz",
	},
] as const;

export const RUST_TARGET = Bun.env.TAURI_ENV_TARGET_TRIPLE ?? Bun.env.RUST_TARGET;

const SIDECAR_DIR = resolve(import.meta.dir, "..", "src-tauri", "sidecars");

export const isWindowsTarget = (target?: string) => Boolean(target?.includes("windows"));

export function getSidecarDestination(target = RUST_TARGET) {
	if (!target) {
		throw new Error("RUST_TARGET not set");
	}

	return join(
		SIDECAR_DIR,
		`opencode-cli-${target}${isWindowsTarget(target) ? ".exe" : ""}`,
	);
}

export function getCurrentSidecar(target = RUST_TARGET) {
	if (!target) {
		throw new Error("RUST_TARGET not set");
	}

	const binaryConfig = SIDECAR_BINARIES.find((binary) => binary.rustTarget === target);
	if (!binaryConfig) {
		throw new Error(`Sidecar configuration not available for Rust target '${target}'`);
	}

	return binaryConfig;
}

export async function copyBinaryToSidecarFolder(source: string, target = RUST_TARGET) {
	if (!target) {
		throw new Error("RUST_TARGET not set");
	}

	await mkdir(SIDECAR_DIR, { recursive: true });
	const dest = getSidecarDestination(target);
	await Bun.write(dest, Bun.file(source));
	if (!isWindowsTarget(target)) {
		await chmod(dest, 0o755);
	}

	console.log(`Copied ${source} to ${dest}`);
}
