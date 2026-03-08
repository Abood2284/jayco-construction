import { absoluteUrl } from "@/lib/seo/config";
import type { CanonicalRoute } from "@/lib/seo/routes";

export const toUrlSetXml = (routes: CanonicalRoute[]) => {
	const lastmod = new Date().toISOString();
	const urls = routes
		.map(
			(route) =>
				`<url><loc>${absoluteUrl(route.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>weekly</changefreq><priority>${route.priority.toFixed(
					1,
				)}</priority></url>`,
		)
		.join("");

	return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
};

export const toSitemapIndexXml = (sitemaps: string[]) => {
	const lastmod = new Date().toISOString();
	const nodes = sitemaps
		.map((path) => `<sitemap><loc>${absoluteUrl(path)}</loc><lastmod>${lastmod}</lastmod></sitemap>`)
		.join("");

	return `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${nodes}</sitemapindex>`;
};
