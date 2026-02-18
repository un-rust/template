import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse, stringify } from "@iarna/toml";
import packageJson from "../package.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const cargoTomlPath = join(__dirname, "..", "Cargo.toml");
const cargoToml = parse(readFileSync(cargoTomlPath, "utf-8")) as {
  package?: { version?: string; [key: string]: unknown };
  [key: string]: unknown;
};

const newVersion = packageJson.version as string;
if (!cargoToml.package) {
  cargoToml.package = { version: newVersion };
} else {
  cargoToml.package.version = newVersion;
}

writeFileSync(cargoTomlPath, stringify(cargoToml), "utf-8");
console.log("Cargo.toml version updated to", newVersion);
