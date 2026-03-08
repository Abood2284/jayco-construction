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

// Only load Cloudflare dev init when not on Vercel (avoids workerd/GLIBC on Vercel builds).
async function getConfig(): Promise<NextConfig> {
	if (process.env.VERCEL !== "1") {
		const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
		initOpenNextCloudflareForDev();
	}
	return nextConfig;
}

export default getConfig();
