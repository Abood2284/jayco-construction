import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: ["/", "/products", "/gallery", "/clients", "/about", "/contact", "/careers"],
			disallow: ["/api/", "/_next/"],
		},
		sitemap: [absoluteUrl("/sitemap.xml")],
	};
}
