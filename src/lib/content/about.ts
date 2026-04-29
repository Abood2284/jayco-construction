import type { Product, ProductCategory, SiteSettings } from "@/lib/cms/types"

export interface AboutPageCta {
	label: string
	href: string
}

export interface AboutPageFeature {
	title: string
	description: string
}

export interface AboutCapabilityGroup {
	title: string
	description: string
	items: string[]
}

export interface AboutIndustry {
	name: string
	description: string
}

/** Numeric stat for count-up display */
export interface AboutProofStat {
	target: number
	label: string
}

export interface AboutCtaLink {
	label: string
	href: string
}

export interface AboutPageContent {
	pageEyebrow: string
	pageTitle: string
	pageDescription: string
	heroHighlights: string[]
	heroPrimaryCta: AboutPageCta
	heroSecondaryCta: AboutPageCta
	companyOverview: {
		eyebrow: string
		title: string
		description: string[]
		quickPoints: string[]
	}
	credibilityPoints: AboutPageFeature[]
	capabilitySection: {
		eyebrow: string
		title: string
		description: string
		groups: AboutCapabilityGroup[]
	}
	industriesSection: {
		eyebrow: string
		title: string
		description: string
		industries: AboutIndustry[]
	}
	proofSection: {
		eyebrow: string
		title: string
		description: string
		stats: AboutProofStat[]
	}
	ctaSection: {
		eyebrow: string
		title: string
		description: string
		links: AboutCtaLink[]
		primaryCta: AboutPageCta
		secondaryCta: AboutPageCta
	}
}

const capabilityConfigs = [
	{
		title: "Cranes and runway coverage",
		description:
			"Overhead, jib, and gantry-oriented equipment for lifting coverage across production bays, fabrication areas, and handling points.",
		categorySlugs: ["eot-cranes", "jib-cranes", "floor-gantry-cranes"],
	},
	{
		title: "Hoists and pulling equipment",
		description:
			"Electric hoists, chain pulley blocks, trolleys, and related pulling equipment for varied duty, clearance, and movement constraints.",
		categorySlugs: ["electric-hoist", "chain-pulley-block"],
	},
	{
		title: "Lifts and vertical handling",
		description:
			"Goods lifts and lifting platforms that support vertical material movement inside industrial and facility workflows.",
		categorySlugs: ["goods-lift", "lifting-platforms"],
	},
	{
		title: "Plant movement and transfer",
		description:
			"Handling equipment for stacking, pallet movement, dock transitions, drum handling, and internal material flow.",
		categorySlugs: ["hydraulic-stacker", "material-transport-docking", "pallet-drum-handling"],
	},
	{
		title: "Rigging and load interface",
		description:
			"Sling options that support broader lifting workflows and load-attachment requirements.",
		categorySlugs: ["sling"],
	},
] as const

const industryDescriptions: Record<string, string> = {
	"Oil & Gas": "Plant maintenance, heavy components, demanding duty.",
	Power: "Utilities and maintenance lifting with reliable load control.",
	"Process Manufacturing": "In-plant movement across production and maintenance areas.",
	Infrastructure: "Yards, projects, and site handling workflows.",
}

function buildCapabilityGroups(categories: ProductCategory[]): AboutCapabilityGroup[] {
	const categoryNameBySlug = new Map(categories.map((category) => [category.slug, category.name]))

	return capabilityConfigs
		.map((config) => ({
			title: config.title,
			description: config.description,
			items: config.categorySlugs
				.map((slug) => categoryNameBySlug.get(slug))
				.filter((value): value is string => Boolean(value)),
		}))
		.filter((group) => group.items.length > 0)
}

function buildIndustries(settings: SiteSettings): AboutIndustry[] {
	return settings.industriesServed.map((industry) => ({
		name: industry,
		description: industryDescriptions[industry] ?? "Industrial lifting and handling.",
	}))
}

export function buildAboutPageContent(
	settings: SiteSettings,
	categories: ProductCategory[],
	products: Product[],
): AboutPageContent {
	const productFamilyCount = categories.length
	const productCount = products.length
	const sectorsServed = settings.industriesServed.join(", ")

	return {
		pageEyebrow: "About Jayco",
		pageTitle: `Built on ${settings.yearsInBusiness} Years of Industrial Lifting Experience`,
		pageDescription:
			"Jayco Hoist & Cranes Mfg. Co. manufactures cranes, hoists, lifts, stackers, slings, and material handling equipment for industrial teams that need dependable load movement, application-fit equipment, and support beyond delivery.",
		heroHighlights: [
			`${settings.yearsInBusiness} yrs`,
			`${productFamilyCount} families`,
			`${settings.industriesServed.length} sectors`,
			"Post-sale support",
		],
		heroPrimaryCta: {
			label: "Explore products",
			href: "/products",
		},
		heroSecondaryCta: {
			label: "Contact Jayco",
			href: "/contact",
		},
		companyOverview: {
			eyebrow: "Company",
			title: "Lifting and material handling, built for industrial use",
			description: [
				"Jayco Hoist & Cranes Mfg. Co. supplies cranes, hoists, goods lifts, stackers, platforms, and slings for plants, workshops, warehouses, and project sites.",
				"We match duty, space, and safety constraints—and stay involved through commissioning and service.",
			],
			quickPoints: [
				"Cranes, hoists, lifts, stackers, transfer gear, slings",
				"Special formats where the catalog lists them (e.g. low headroom, flameproof)",
				"Commissioning and maintenance support",
			],
		},
		credibilityPoints: [
			{
				title: `${settings.yearsInBusiness} years`,
				description: "Established manufacturer—not a trading-only storefront.",
			},
			{
				title: `${productFamilyCount} product families`,
				description: `${productCount} catalog items across lifting and handling.`,
			},
			{
				title: `${settings.industriesServed.length} sectors`,
				description: sectorsServed,
			},
			
		],
		capabilitySection: {
			eyebrow: "Capabilities",
			title: "What we cover",
			description: "Grouped to match the live catalog—scope at a glance.",
			groups: buildCapabilityGroups(categories),
		},
		industriesSection: {
			eyebrow: "Sectors",
			title: "Where our equipment shows up",
			description: "Sectors from current site settings.",
			industries: buildIndustries(settings),
		},
		proofSection: {
			eyebrow: "Snapshot",
			title: "By the numbers",
			description: "From site settings and the published catalog.",
			stats: [
				{ target: settings.yearsInBusiness, label: "Years in business" },
				{ target: productFamilyCount, label: "Product families" },
				{ target: productCount, label: "Catalog items" },
				{ target: settings.industriesServed.length, label: "Sectors" },
			],
		},
		ctaSection: {
			eyebrow: "Next step",
			title: "Where to go next",
			description: "",
			links: [
				{ label: "Browse products", href: "/products" },
				{ label: "Installations", href: "/gallery" },
				{ label: "Contact", href: "/contact" },
			],
			primaryCta: {
				label: "Request quote",
				href: "/contact",
			},
			secondaryCta: {
				label: "View installations",
				href: "/gallery",
			},
		},
	}
}
