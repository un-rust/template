import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import inquirer from "inquirer";
import { logger } from "rslog";

logger.greet("Welcome to the UnRust Init Script!");

const { name } = await inquirer.prompt<{ name: string }>([
	{
		type: "input",
		name: "name",
		message: "Enter the name of the project",
	},
]);

const root = join(import.meta.dirname, "..");

for (const file of ["Cargo.toml", "README.md"]) {
	const path = join(root, file);
	const content = await readFile(path, "utf-8");
	await writeFile(path, content.replaceAll("package-name", name));
}

logger.success(
	`Replaced "package-name" with "${name}" in Cargo.toml and README.md`,
);
