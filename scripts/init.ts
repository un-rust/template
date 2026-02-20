import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import inquirer from "inquirer";
import { logger } from "rslog";
import { rootDir } from "./shared.js";

async function main() {
	logger.greet("Welcome to the UnRust Init Script!");

	const { name } = await inquirer.prompt<{ name: string }>([
		{
			type: "input",
			name: "name",
			message: "Enter the name of the project",
		},
	]);

	for (const file of ["Cargo.toml", "README.md"]) {
		const path = join(rootDir, file);
		const content = await readFile(path, "utf-8");
		await writeFile(path, content.replaceAll("package-name", name));
	}

	logger.success(
		`Replaced "package-name" with "${name}" in Cargo.toml and README.md`,
	);
}

main().catch((err) => {
	logger.error(err);
	process.exit(1);
});
