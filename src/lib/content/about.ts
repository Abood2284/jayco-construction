import type { Product, ProductCategory, SiteSettings } from "@/lib/cms/types"

export interface AboutPageCta {
	label: string
	href: string
}

export interface AboutPageFeature {
	title: string
	description: string
}

export interface AboutHeroPanelItem extends AboutPageFeature {
	label: string
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

export interface AboutProofStat {
	value: string
	label: string
	description: string
}

export interface AboutRouteCard {
	title: string
	description: string
	href: string
}

export interface AboutPageContent {
	pageEyebrow: string
	pageTitle: string
	pageDescription: string
	heroHighlights: string[]
	heroPrimaryCta: AboutPageCta
	heroSecondaryCta: AboutPageCta
	heroPanelTitle: string
	heroPanelItems: AboutHeroPanelItem[]
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
	qualitySection: {
		eyebrow: string
		title: string
		description: string
		points: AboutPageFeature[]
	}
	whyJaycoSection: {
		eyebrow: string
		title: string
		description: string
		points: AboutPageFeature[]
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
		routes: AboutRouteCard[]
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
	"Oil & Gas":
		"Lifting and handling relevance for plant equipment, maintenance workflows, and demanding operating conditions.",
	Power:
		"Support for utility, maintenance, and heavy-component movement where reliability and load control matter.",
	"Process Manufacturing":
		"Material movement fit across production areas, maintenance zones, and day-to-day plant handling requirements.",
	Infrastructure:
		"Equipment relevance for fabrication yards, project support activity, and heavy-duty site workflows.",
}

function pluralize(count: number, singular: string, plural = `${singular}s`) {
	return `${count} ${count === 1 ? singular : plural}`
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
		description:
			industryDescriptions[industry] ??
			"Industrial lifting and material-handling relevance for demanding operations.",
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
	const standardsSummary = settings.standards.join(" • ")

	return {
		pageEyebrow: "About Jayco",
		pageTitle: `Built on ${settings.yearsInBusiness} Years of Industrial Lifting Experience`,
		pageDescription:
			"Jayco Hoist & Cranes Mfg. Co. manufactures cranes, hoists, lifts, stackers, slings, and material handling equipment for industrial teams that need dependable load movement, application-fit equipment, and support beyond delivery.",
		heroHighlights: [
			`${settings.yearsInBusiness} years in business`,
			`${pluralize(productFamilyCount, "product family")}`,
			`${pluralize(settings.industriesServed.length, "core sector")} served`,
			"Commissioning and maintenance support",
		],
		heroPrimaryCta: {
			label: "Explore Products",
			href: "/products",
		},
		heroSecondaryCta: {
			label: "Contact Jayco",
			href: "/contact",
		},
		heroPanelTitle: "Company snapshot",
		heroPanelItems: [
			{
				label: "Industrial focus",
				title: "Material lifting and handling equipment",
				description:
					"Jayco's current site content centers on cranes, hoists, lifts, stackers, docking, pallet handling, and sling systems.",
			},
			{
				label: "Current range",
				title: `${productFamilyCount} product families across ${productCount} catalog entries`,
				description:
					"A broad current catalog lets buyers validate scope quickly without mistaking the About page for a full product listing.",
			},
			{
				label: "Operational continuity",
				title: "Support beyond supply",
				description: settings.serviceSupport,
			},
		],
		companyOverview: {
			eyebrow: "Company Overview",
			title: "Who Jayco is and what kind of industrial company it is",
			description: [
				"Jayco operates in industrial lifting and material handling, supplying equipment used to move, raise, position, and support loads across plant, workshop, warehouse, and project-site workflows.",
				"The current product range spans cranes, electric hoists, goods lifts, stackers, lifting platforms, transfer equipment, and sling systems, giving buyers a clearer picture of Jayco's industrial operating scope without forcing an exhaustive catalog browse.",
			],
			quickPoints: [
				"Focused on industrial lifting and material handling",
				"Current catalog coverage across cranes, hoists, lifts, stackers, transfer equipment, and slings",
				"Standard range with application-specific equipment types already present in the live catalog",
			],
		},
		credibilityPoints: [
			{
				title: `${settings.yearsInBusiness} years in business`,
				description:
					"Current site settings position Jayco as an established company rather than a newly assembled trading page.",
			},
			{
				title: `${pluralize(productFamilyCount, "product family")} in the live catalog`,
				description:
					"Published product coverage spans cranes, hoists, lifts, stackers, docking equipment, pallet and drum handling, and slings.",
			},
			{
				title: `${pluralize(settings.industriesServed.length, "sector")} served`,
				description: sectorsServed,
			},
			{
				title: "Standards and support already stated on the site",
				description: `${standardsSummary} with ${settings.serviceSupport.toLowerCase()}`,
			},
		],
		capabilitySection: {
			eyebrow: "Capabilities",
			title: "What Jayco does across lifting and material handling",
			description:
				"The goal here is scope clarity, not catalog repetition. These grouped capabilities show where Jayco sits in the broader handling workflow.",
			groups: buildCapabilityGroups(categories),
		},
		industriesSection: {
			eyebrow: "Sectors Served",
			title: "Industrial environments already reflected in current site settings",
			description:
				"Jayco's current content lists the following sectors, giving buyers a faster read on operational fit before they move deeper into products or installations.",
			industries: buildIndustries(settings),
		},
		qualitySection: {
			eyebrow: "Quality, Process, Reliability",
			title: "Trust signals that go beyond a simple years-in-business claim",
			description:
				"This layer keeps the message practical: standards context, support continuity, and application-fit equipment coverage already visible in the project content.",
			points: [
				{
					title: "Standards-aware manufacturing context",
					description: standardsSummary,
				},
				{
					title: "Commissioning and maintenance continuity",
					description: settings.serviceSupport,
				},
				{
					title: "Application-fit equipment range",
					description:
						"The live catalog includes low-headroom, flameproof, explosion-proof, under-slung, hydraulic, and mobile formats for different operational constraints.",
				},
			],
		},
		whyJaycoSection: {
			eyebrow: "Why Jayco",
			title: "Why the company feels commercially relevant, not just informational",
			description:
				"Each differentiator is grounded in content already present across site settings and the current catalog.",
			points: [
				{
					title: "Industrial-first product scope",
					description:
						"Jayco's range stays anchored to real lifting and handling needs instead of drifting into generic corporate positioning.",
				},
				{
					title: "Mature operating profile",
					description: `${settings.yearsInBusiness} years in business gives buyers a clearer signal of continuity and market presence.`,
				},
				{
					title: "Breadth without losing relevance",
					description: `${productFamilyCount} current product families create useful breadth while staying within lifting, movement, and handling workflows.`,
				},
				{
					title: "Support that extends past dispatch",
					description:
						"Commissioning and maintenance language on the site helps frame Jayco as a longer-term equipment partner, not only a product supplier.",
				},
			],
		},
		proofSection: {
			eyebrow: "Proof Strip",
			title: "Compact reassurance before the next step",
			description:
				"These figures are derived from current site settings and the published catalog, keeping the proof layer factual and restrained.",
			stats: [
				{
					value: String(settings.yearsInBusiness),
					label: "Years in business",
					description: "Company maturity already published in site settings.",
				},
				{
					value: String(productFamilyCount),
					label: "Product families",
					description: "Current catalog families across the live product structure.",
				},
				{
					value: String(productCount),
					label: "Catalog entries",
					description: "Published product entries currently available on the site.",
				},
				{
					value: String(settings.industriesServed.length),
					label: "Core sectors",
					description: "Industrial sectors explicitly listed in current settings.",
				},
			],
		},
		ctaSection: {
			eyebrow: "Next Step",
			title: "Move from company profile to a commercial decision path",
			description:
				"After trust is established, the page should make the next move obvious: browse the range, inspect field work, or discuss a live requirement.",
			routes: [
				{
					title: "Explore products",
					description:
						"Use the live catalog to narrow the right family across cranes, hoists, lifts, stackers, and supporting handling equipment.",
					href: "/products",
				},
				{
					title: "View installations",
					description:
						"See gallery and field visuals for more operational context before moving into an enquiry.",
					href: "/gallery",
				},
				{
					title: "Contact Jayco",
					description:
						"Start a quote or requirement discussion if you already know the lifting or material-handling need.",
					href: "/contact",
				},
			],
			primaryCta: {
				label: "Request Quote",
				href: "/contact",
			},
			secondaryCta: {
				label: "View Installations",
				href: "/gallery",
			},
		},
	}
}
