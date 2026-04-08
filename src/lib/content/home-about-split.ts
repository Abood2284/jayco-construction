import type { SiteSettings } from "@/lib/cms/types"

export interface HomeAboutSplitColumn {
	eyebrow: string
	title: string
	paragraphs: string[]
	features?: string[]
	cta: { label: string; href: string }
}

export interface HomeAboutSplitContent {
	left: HomeAboutSplitColumn
	right: HomeAboutSplitColumn
}

/**
 * Sectors in the long-form copy use `settings.industriesServed` so this block stays aligned
 * with the About page and site settings (same source as `buildAboutPageContent`).
 */
export function buildHomeAboutSplitContent(settings: SiteSettings): HomeAboutSplitContent {
	const years = settings.yearsInBusiness
	const sectorsPhrase = formatSectorsList(settings.industriesServed)

	return {
		left: {
			eyebrow: "About Company",
			title: settings.companyName,
			paragraphs: [
				`${settings.shortName} is one of the leading manufacturers of electric hoists, cranes, goods lifts, hydraulic lifts, stackers, and other material handling equipment.`,
				`We cater to the needs of core industries—${sectorsPhrase}. ${settings.companyName} has been serving industrial customers in India and overseas for over ${years} years, with expertise in industrial lifting and material handling equipment. Our products support safe loading, unloading, shifting, or lifting materials from one place to another or from ground level to higher floors. They are valued for reliable performance, corrosion resistance, and long service life. We build from high-quality raw materials, ensure safe and timely delivery, and offer custom-built solutions to customer specifications—all at competitive prices.`,
			],
			cta: { label: "Read more", href: "/about" },
		},
		right: {
			eyebrow: "Why choose us",
			title: "Special Features",
			paragraphs: [
				`${settings.shortName} products are strong and sturdy, with modular construction, innovative design, and a focus on quality and safety.`,
			],
			features: [
				"Well equipped manufacturing set up.",
				"Competitive prices.",
				"Modular construction and robust design.",
				"Quality products with proven design and expertise.",
			],
			cta: { label: "Read more", href: "/about" },
		},
	}
}

function formatSectorsList(sectors: string[]): string {
	if (sectors.length === 0) return "industrial sectors"
	if (sectors.length === 1) return sectors[0] ?? "industrial sectors"
	if (sectors.length === 2) return `${sectors[0]} and ${sectors[1]}`
	const head = sectors.slice(0, -1).join(", ")
	const tail = sectors[sectors.length - 1]
	return `${head}, and ${tail}`
}
