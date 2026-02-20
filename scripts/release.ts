import { existsSync, promises as fsp } from "node:fs";
import {
	generateMarkDown,
	getGitDiff,
	loadChangelogConfig,
	parseCommits,
	resolveGithubToken,
	syncGithubRelease,
} from "changelogen";
import open from "open";
import { logger } from "rslog";
import { getVersionFromCargo, rootDir } from "./shared.js";

async function main() {
	process.chdir(rootDir);
	logger.greet("Welcome to the UnRust Release Script!");

	const version = await getVersionFromCargo();
	logger.info("Current version: %s", version);

	const config = await loadChangelogConfig(rootDir, {
		newVersion: version,
		output: "CHANGELOG.md",
	});

	logger.info("Generating changelog for %s...%s", config.from || "", config.to);

	const rawCommits = await getGitDiff(config.from, config.to, config.cwd);
	const commits = parseCommits(rawCommits, config)
		.map((c) => ({ ...c, type: c.type.toLowerCase() }))
		.filter(
			(c) =>
				config.types[c.type] &&
				!(
					c.type === "chore" &&
					["deps", "release"].includes(c.scope) &&
					!c.isBreaking
				),
		);

	const markdown = await generateMarkDown(commits, config);
	const body = markdown
		.split("\n")
		.slice(2)
		.join("\n")
		.replaceAll(/\(\[(@.+)\]\(.+\)\)/g, "($1)");

	const release = { version, body };

	if (config.repo?.provider !== "github") {
		logger.error("Release script only supports GitHub repositories.");
		process.exit(1);
	}

	config.tokens.github =
		config.tokens.github ||
		(await resolveGithubToken(config).catch(() => undefined));

	if (typeof config.output === "string") {
		let changelogMD: string;
		if (existsSync(config.output)) {
			changelogMD = await fsp.readFile(config.output, "utf8");
		} else {
			changelogMD = "# Changelog\n\n";
		}
		const lastEntry = changelogMD.match(/^###?\s+.*$/m);
		if (lastEntry) {
			changelogMD =
				changelogMD.slice(0, lastEntry.index) +
				markdown +
				"\n\n" +
				changelogMD.slice(lastEntry.index);
		} else {
			changelogMD += `\n${markdown}\n\n`;
		}
		await fsp.writeFile(config.output, changelogMD);
		logger.success("Updated %s", config.output);
	}

	const result = await syncGithubRelease(config, release);

	if (result.status === "manual") {
		const url = result.url!;
		logger.info("Opening GitHub release page with pre-filled data...");
		await open(url).catch(() => {
			logger.info("Open this link to create the release manually:\n%o", url);
		});
	} else {
		logger.success("Release v%s synced to GitHub!", version);
	}
}

main().catch((err) => {
	logger.error(err);
	process.exit(1);
});
