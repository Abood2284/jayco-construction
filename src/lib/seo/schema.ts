import type { Product, SiteSettings } from "@/lib/cms/types";
import { absoluteUrl } from "@/lib/seo/config";

export const buildOrganizationSchema = (settings: SiteSettings) => ({
	"@context": "https://schema.org",
	"@type": "Organization",
	name: settings.companyName,
	url: absoluteUrl("/"),
	logo: absoluteUrl(settings.logo.src),
	contactPoint: settings.phones.map((phone) => ({
		"@type": "ContactPoint",
		telephone: phone,
		contactType: "sales",
	})),
});

export const buildLocalBusinessSchema = (settings: SiteSettings) => ({
	"@context": "https://schema.org",
	"@type": "LocalBusiness",
	name: settings.companyName,
	url: absoluteUrl("/contact"),
	address: {
		"@type": "PostalAddress",
		streetAddress: settings.address,
	},
	email: settings.emails,
	telephone: settings.phones,
});

export const buildBreadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
	"@context": "https://schema.org",
	"@type": "BreadcrumbList",
	itemListElement: items.map((item, index) => ({
		"@type": "ListItem",
		position: index + 1,
		name: item.name,
		item: absoluteUrl(item.path),
	})),
});

export const buildProductSchema = (product: Product, categoryName: string) => ({
	"@context": "https://schema.org",
	"@type": "Product",
	name: product.seo?.title ?? product.name,
	category: categoryName,
	description: product.description,
	image: product.heroImages.map((image) => absoluteUrl(image.src)),
	brand: {
		"@type": "Brand",
		name: "Jayco Hoist & Cranes Mfg. Co.",
	},
	offers: {
		"@type": "Offer",
		priceCurrency: "INR",
		availability: "https://schema.org/InStock",
		url: absoluteUrl(`/products/${product.categorySlug}/${product.slug}`),
		priceSpecification: {
			"@type": "PriceSpecification",
			price: "0",
			priceCurrency: "INR",
			description: "Price on request",
		},
	},
	additionalProperty: product.specs.map((spec) => ({
		"@type": "PropertyValue",
		name: spec.label,
		value: spec.value,
	})),
});
