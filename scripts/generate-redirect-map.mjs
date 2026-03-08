#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";

const [inventoryPath = "scripts/output/legacy-url-inventory.csv", outputPath = "scripts/output/redirect-map.csv"] = process.argv.slice(2);

const rules = JSON.parse(await readFile("src/lib/seo/legacy-redirect-rules.json", "utf8"));
const ruleMap = new Map(rules.map((rule) => [rule.oldPath, rule]));

const normalizeInputPath = (path) => {
	let normalized = path.trim();
	if (!normalized.startsWith("/")) normalized = `/${normalized}`;
	return normalized.replace(/\/+/g, "/");
};

const canonicalizePath = (path) => {
	const normalized = normalizeInputPath(path);
	const lower = normalized.toLowerCase();
	if (lower.length > 1 && lower.endsWith("/")) {
		return lower.slice(0, -1);
	}
	return lower;
};

const inferDestination = (oldPath) => {
	const normalized = normalizeInputPath(oldPath);
	const direct = ruleMap.get(normalized);
	if (direct) {
		return { newPath: direct.newPath, notes: direct.notes ?? "Manual mapping" };
	}

	const canonicalOld = canonicalizePath(normalized);
	if (canonicalOld === "/index" || canonicalOld === "/index.html") {
		return { newPath: "/", notes: "Index normalization" };
	}

	if (canonicalOld.endsWith(".html")) {
		const stripped = canonicalizePath(canonicalOld.replace(/\.html$/, ""));
		const maybe = ruleMap.get(`${stripped}.html`);
		if (maybe) {
			return { newPath: maybe.newPath, notes: maybe.notes ?? "Mapped via html variant" };
		}
		return { newPath: stripped, notes: "HTML suffix removal" };
	}

	if (normalized !== normalized.toLowerCase()) {
		return { newPath: canonicalOld, notes: "Lowercase normalization" };
	}

	if (normalized !== "/" && normalized.endsWith("/")) {
		return { newPath: canonicalOld, notes: "Trailing slash normalization" };
	}

	return null;
};

let inventoryRows = [];
try {
	const inventoryRaw = await readFile(inventoryPath, "utf8");
	inventoryRows = inventoryRaw
		.split(/\r?\n/)
		.slice(1)
		.filter(Boolean)
		.map((line) => line.split(",")[0])
		.map((path) => normalizeInputPath(path));
} catch {
	inventoryRows = [];
}

const oldPaths = new Set([...inventoryRows, ...rules.map((rule) => rule.oldPath)]);
const mapped = [...oldPaths]
	.map((oldPath) => {
		const inferred = inferDestination(oldPath);
		if (!inferred || canonicalizePath(oldPath) === canonicalizePath(inferred.newPath)) {
			return null;
		}
		return {
			oldPath: normalizeInputPath(oldPath),
			newPath: canonicalizePath(inferred.newPath),
			type: "301",
			notes: inferred.notes,
		};
	})
	.filter(Boolean)
	.sort((a, b) => a.oldPath.localeCompare(b.oldPath));

await mkdir(outputPath.split("/").slice(0, -1).join("/"), { recursive: true });
const csvRows = ["old_path,new_path,type,notes", ...mapped.map((entry) => `${entry.oldPath},${entry.newPath},${entry.type},${entry.notes}`)];
await writeFile(outputPath, `${csvRows.join("\n")}\n`, "utf8");

console.log(`Wrote ${mapped.length} redirect mappings to ${outputPath}`);
