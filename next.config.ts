import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { NextConfig } from "next";

import type { RedirectRule } from "./src/lib/seo/redirects";

const redirectRules = JSON.parse(
	readFileSync(join(process.cwd(), "src/lib/seo/legacy-redirect-rules.json"), "utf8"),
) as RedirectRule[];

const nextConfig: NextConfig = {
	trailingSlash: false,
	async redirects() {
		return redirectRules.map((rule) => ({
			source: rule.oldPath,
			destination: rule.newPath,
			permanent: true,
		}));
	},
};

export default nextConfig;

// Enable calling `getCloudflareContext()` in `next dev`.
// See https://opennext.js.org/cloudflare/bindings#local-access-to-bindings.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
