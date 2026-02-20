import { logger } from "rslog";
import { parse } from "@iarna/toml";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import inquirer from "inquirer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const cargoTomlPath = join(__dirname, "..", "Cargo.toml");
const cargoTomlContent = readFileSync(cargoTomlPath, "utf-8");
const cargoToml = parse(cargoTomlContent);

// @ts-ignore
const version = cargoToml["package"]?.version as string;

logger.greet("Welcome to the UnRust Bump Script!");

logger.info("Current version: %s", version);

const newVersion = await inquirer.prompt([
  {
    type: "input",
    name: "version",
    message: "Enter the new version",
    default: version,
  },
]);

logger.info("New version: %s", newVersion.version);

const confirm = await inquirer.prompt([
  {
    type: "confirm",
    name: "confirm",
    message: "Are you sure you want to bump the version?",
    default: true,
  },
]);

if (!confirm.confirm) {
  logger.info("Version bump cancelled");
  process.exit(0);
}

const newCargoTomlContent = cargoTomlContent.replace(
  `version = "${version}"`,
  `version = "${newVersion.version}"`,
);
writeFileSync(cargoTomlPath, newCargoTomlContent);

logger.success("Version bumped successfully");
process.exit(0);
