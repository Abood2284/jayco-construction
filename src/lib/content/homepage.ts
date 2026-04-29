import type { Client, Product, SiteSettings } from "@/lib/cms/types"

export interface HomepageCta {
	label: string
	href: string
}

export interface HomepageTrustStat {
	icon: "history" | "layers" | "factory" | "shield" | "wrench"
	title: string
	description: string
}

export interface HomepageHeroContent {
	eyebrow: string
	title: string
	trustStats: HomepageTrustStat[]
}

export interface HomepageFlagshipProduct {
	title: string
	categoryLabel: string
	shortDescription: string
	image: Product["heroImages"][number]
	href: string
	quickPoints: string[]
	quoteHref: string
}

export interface HomepageFlagshipContent {
	eyebrow: string
	title: string
	description: string
	featuredProducts: HomepageFlagshipProduct[]
	primaryCta: HomepageCta
	secondaryCta: HomepageCta
}

export interface HomepageLogoProofContent {
	eyebrow: string
	title: string
	description: string
	logos: Client[]
	supportingStatement: string
	primaryCta: HomepageCta
	secondaryCta: HomepageCta
}

const HOMEPAGE_FLAGSHIP_PRODUCT_SLUGS = [
	"chain-electric-hoist",
	"single-girder",
	"hydraulic-lift",
	"column-mounted",
] as const

const HOMEPAGE_VISIBLE_LOGO_COUNT = 12

function pluralize(count: number, singular: string, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`
}

function toTitleCase(value: string) {
	return value
		.split(/[-\s]+/)
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(" ")
}

function takeFirstSentence(value: string) {
	const trimmed = value.trim()
	if (!trimmed) return trimmed
	const firstSentence = trimmed.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? trimmed
	return firstSentence.trim()
}

function normalizeSpecLabel(label: string) {
	return label
		.replace(/\(.*?\)/g, "")
		.replace(/^reference project[—-]\s*/i, "")
		.replace(/\s+/g, " ")
		.trim()
}

function buildQuickPoints(product: Product) {
	const featurePoints = product.features.map((feature) => feature.trim()).filter(Boolean)
	const specPoints = product.specs
		.filter((spec) => {
			const normalizedLabel = spec.label.trim().toLowerCase()
			return !/^(minimum order quantity|brand|country of origin|i deal in|model name\/number|production capacity|delivery time)$/i.test(
				normalizedLabel,
			)
		})
		.map((spec) => `${normalizeSpecLabel(spec.label)}: ${spec.value.trim()}`)

	return [...featurePoints, ...specPoints].slice(0, 3)
}

function buildPreferredProductList(products: Product[]) {
	const productBySlug = new Map(products.map((product) => [product.slug, product]))
	const preferred = HOMEPAGE_FLAGSHIP_PRODUCT_SLUGS.map((slug) => productBySlug.get(slug)).filter(
		(product): product is Product => Boolean(product),
	)

	if (preferred.length >= 4) return preferred

	const seen = new Set(preferred.map((product) => product.slug))
	for (const product of products) {
		if (seen.has(product.slug)) continue
		preferred.push(product)
		seen.add(product.slug)
		if (preferred.length === 4) break
	}

	return preferred
}

export function buildHomepageHeroContent(settings: SiteSettings, products: Product[]): HomepageHeroContent {
	const productFamilyCount = new Set(products.map((product) => product.categorySlug)).size
	const sectorsServed = settings.industriesServed.join(", ")

	return {
		eyebrow: "Heavy-duty material handling",
		title: "Cranes, hoists, lifts & industrial handling equipment",
		trustStats: [
			{
				icon: "history",
				title: `${settings.yearsInBusiness} years in business`,
				description: "Established manufacturing experience across industrial lifting and handling requirements.",
			},
			{
				icon: "layers",
				title: `${pluralize(productFamilyCount, "product family")}`,
				description: `${products.length} current catalog entries spanning cranes, hoists, lifts, stackers, and handling equipment.`,
			},
			{
				icon: "factory",
				title: `${pluralize(settings.industriesServed.length, "sector")} served`,
				description: sectorsServed,
			},
			
			{
				icon: "wrench",
				title: "Lifecycle support",
				description: settings.serviceSupport,
			},
		],
	}
}

export function buildHomepageFlagshipContent(products: Product[]): HomepageFlagshipContent {
	const featuredProducts = buildPreferredProductList(products).map((product) => ({
		title: product.name,
		categoryLabel: toTitleCase(product.categorySlug),
		shortDescription: takeFirstSentence(product.excerpt ?? product.description),
		image: product.heroImages[0],
		href: `/products/${product.categorySlug}/${product.slug}`,
		quickPoints: buildQuickPoints(product),
		quoteHref: "/contact",
	}))

	return {
		eyebrow: "Flagship Industrial Equipment",
		title: "Start with the systems buyers ask about most",
		description:
			"A tighter shortlist of current Jayco equipment gives buyers a faster way into the catalog without forcing them through repeated cards or guide-style copy.",
		featuredProducts,
		primaryCta: {
			label: "Browse Full Catalog",
			href: "/products",
		},
		secondaryCta: {
			label: "Request Quote",
			href: "/contact",
		},
	}
}

export function buildHomepageLogoProofContent(
	clients: Client[],
	settings: SiteSettings,
): HomepageLogoProofContent {
	return {
		eyebrow: "Client Proof",
		title: "Trusted across industrial operations",
		description:
			"A restrained selection from Jayco's current logo library keeps the proof credible, fast to scan, and supportive of the buying journey.",
		logos: clients.slice(0, HOMEPAGE_VISIBLE_LOGO_COUNT),
		supportingStatement: `Supplying lifting and handling systems for ${settings.industriesServed.join(", ")} teams.`,
		primaryCta: {
			label: "View All Clients",
			href: "/clients",
		},
		secondaryCta: {
			label: "Talk To Jayco",
			href: "/contact",
		},
	}
}
