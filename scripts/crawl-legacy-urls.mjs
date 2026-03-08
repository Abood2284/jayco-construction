#!/usr/bin/env node

import { writeFile } from "node:fs/promises";

const [baseUrlArg, outputPath = "scripts/output/legacy-url-inventory.csv"] = process.argv.slice(2);
const maxPages = Number(process.env.CRAWL_MAX_PAGES ?? "4000");

if (!baseUrlArg) {
	console.error("Usage: node scripts/crawl-legacy-urls.mjs <base-url> [output-csv]");
	process.exit(1);
}

const baseUrl = new URL(baseUrlArg);

const normalizePath = (pathname) => {
	if (!pathname) return "/";
	return pathname;
};

const toAbsolute = (href, currentUrl) => {
	try {
		return new URL(href, currentUrl);
	} catch {
		return null;
	}
};

const extractLinks = (html) => {
	const matches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)];
	return matches.map((match) => match[1]);
};

const extractCanonical = (html, currentUrl) => {
	const canonicalMatch = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["'][^>]*>/i);
	if (!canonicalMatch) {
		return "";
	}
	const canonicalUrl = toAbsolute(canonicalMatch[1], currentUrl);
	if (!canonicalUrl) {
		return "";
	}
	return normalizePath(canonicalUrl.pathname);
};

const isNoIndex = (html) => /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);

const records = new Map();
const queue = [baseUrl.href];
const queued = new Set(queue);

const fetchRecord = async (url) => {
	let response;
	try {
		response = await fetch(url, {
			redirect: "follow",
			headers: {
				"user-agent": "AntigravityMigrationBot/1.0",
			},
		});
	} catch {
		return null;
	}

	const contentType = response.headers.get("content-type") ?? "";
	const html = contentType.includes("text/html") ? await response.text() : "";
	return {
		response,
		html,
		contentType,
		indexable: response.ok && contentType.includes("text/html") && !isNoIndex(html),
		canonical: html ? extractCanonical(html, url) : "",
	};
};

while (queue.length > 0 && queued.size <= maxPages) {
	const current = queue.shift();
	if (!current) {
		break;
	}

	const result = await fetchRecord(current);
	if (!result) {
		continue;
	}
	const { response, html, indexable, canonical } = result;

	const url = new URL(current);
	const path = normalizePath(url.pathname);

	records.set(path, {
		path,
		statusCode: response.status,
		indexable,
		canonical,
		source: current,
	});

	if (!html) {
		continue;
	}

	for (const href of extractLinks(html)) {
		const linked = toAbsolute(href, current);
		if (!linked || linked.hostname !== baseUrl.hostname) {
			continue;
		}

		linked.hash = "";
		linked.search = "";
		const normalized = linked.href;
		if (!queued.has(normalized)) {
			queued.add(normalized);
			queue.push(normalized);
		}
	}
}

const variantCandidates = new Set();
for (const path of records.keys()) {
	if (path === "/") {
		variantCandidates.add("/index.html");
		continue;
	}
	if (!path.endsWith("/")) {
		variantCandidates.add(`${path}/`);
	}
	if (!path.endsWith(".html")) {
		variantCandidates.add(`${path}.html`);
	}
	if (path.endsWith(".html")) {
		variantCandidates.add(path.replace(/\.html$/, ""));
	}
}

for (const variant of variantCandidates) {
	const normalizedVariant = normalizePath(variant);
	if (records.has(normalizedVariant)) {
		continue;
	}
	const variantUrl = new URL(normalizedVariant, baseUrl).href;
	const result = await fetchRecord(variantUrl);
	if (!result || !result.indexable) {
		continue;
	}
	records.set(normalizedVariant, {
		path: normalizedVariant,
		statusCode: result.response.status,
		indexable: result.indexable,
		canonical: result.canonical,
		source: variantUrl,
	});
}

const header = "path,status_code,indexable,canonical,source";
const rows = [...records.values()]
	.sort((a, b) => a.path.localeCompare(b.path))
	.map((entry) => [entry.path, entry.statusCode, entry.indexable ? "yes" : "no", entry.canonical, entry.source].join(","));

await writeFile(outputPath, `${header}\n${rows.join("\n")}\n`, "utf8");
console.log(`Wrote ${rows.length} URLs to ${outputPath}`);
