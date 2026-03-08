import { getCanonicalRoutes } from "@/lib/seo/routes";
import { toUrlSetXml } from "@/lib/seo/sitemap";

export async function GET() {
	const routes = (await getCanonicalRoutes()).filter(
		(route) => !route.path.startsWith("/products") && !route.path.startsWith("/gallery/"),
	);

	return new Response(toUrlSetXml(routes), {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}
