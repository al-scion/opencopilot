import Bun from "bun";
import { unregisterAddIn } from "office-addin-dev-settings";
import { customFunctionsConfig, shortcutsConfig } from "../src/lib/excel/config";

const cwd = `${import.meta.dir}/..`;
const configDirectory = `${cwd}/public/config`;
const manifestPath = `${cwd}/manifest-dev.xml`;

await Bun.$`mkdir -p ${configDirectory}`;
await Bun.write(`${configDirectory}/shortcuts.json`, JSON.stringify(shortcutsConfig, null, 2));
await Bun.write(`${configDirectory}/functions.json`, JSON.stringify(customFunctionsConfig, null, 2));

const cleanup = async () => await unregisterAddIn(manifestPath).catch();
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
process.on("exit", cleanup);

await Bun.$.cwd(cwd)`vite dev`;
