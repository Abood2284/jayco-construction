import { toSitemapIndexXml } from "@/lib/seo/sitemap";

export function GET() {
	const body = toSitemapIndexXml(["/sitemap-pages.xml", "/sitemap-products.xml", "/sitemap-gallery.xml"]);
	return new Response(body, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
