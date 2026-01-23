import Bun from "bun";
import { customFunctionsConfig, shortcutsConfig } from "../src/lib/excel/config";

const configDirectory = `${import.meta.dir}/../config`;

await Bun.$`mkdir -p ${configDirectory}`;
await Bun.write(`${configDirectory}/shortcuts.json`, JSON.stringify(shortcutsConfig, null, 2));
await Bun.write(`${configDirectory}/functions.json`, JSON.stringify(customFunctionsConfig, null, 2));
