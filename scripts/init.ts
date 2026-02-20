import { existsSync } from "node:fs";
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

	const crateName = name.replace(/-/g, "_");

	for (const file of ["Cargo.toml", "README.md", "package.json"]) {
		const path = join(rootDir, file);
		if (!existsSync(path)) continue;
		const content = await readFile(path, "utf-8");
		await writeFile(path, content.replaceAll("package-name", name));
	}

	const testPath = join(rootDir, "tests", "integration_test.rs");
	if (existsSync(testPath)) {
		const content = await readFile(testPath, "utf-8");
		await writeFile(testPath, content.replaceAll("package_name", crateName));
	}

	// clean the changelog
	await writeFile(join(rootDir, "CHANGELOG.md"), "");

	logger.success(
		`Replaced "package-name" with "${name}" in Cargo.toml, README.md, package.json; crate name in tests set to "${crateName}".`,
	);
}

main().catch((err) => {
	logger.error(err);
	process.exit(1);
});
