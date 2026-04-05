import type { ImageAsset, Product, ProductCategory } from "@/lib/cms/types"

export interface HeroSpotlight {
	title: string
	href: string
	image: ImageAsset
}

type SpotlightConfig =
	| {
			kind: "category"
			categorySlug: string
			label: string
			/** When set, use this product's hero for the card image (link still goes to the category). */
			heroImageFromProduct?: { categorySlug: string; productSlug: string }
	  }
	| { kind: "product"; categorySlug: string; productSlug: string; label: string }

const HERO_SPOTLIGHT_ORDER: SpotlightConfig[] = [
	{ kind: "category", categorySlug: "electric-hoist", label: "Electric Hoist" },
	{ kind: "product", categorySlug: "eot-cranes", productSlug: "single-girder", label: "EOT Single Girder" },
	{ kind: "product", categorySlug: "eot-cranes", productSlug: "double-girder", label: "EOT Double Girder" },
	{ kind: "product", categorySlug: "eot-cranes", productSlug: "under-slung", label: "EOT Under Slung" },
	{ kind: "category", categorySlug: "jib-cranes", label: "JIB Cranes" },
	{
		kind: "category",
		categorySlug: "hydraulic-stacker",
		label: "Hydraulic Stacker",
		heroImageFromProduct: { categorySlug: "hydraulic-stacker", productSlug: "battery-operated" },
	},
	{ kind: "category", categorySlug: "goods-lift", label: "Goods Lift" },
	{ kind: "category", categorySlug: "chain-pulley-block", label: "Chain Pulleys" },
	{
		kind: "product",
		categorySlug: "pallet-drum-handling",
		productSlug: "drum-trolley-stackers",
		label: "Drum Stackers",
	},
	{ kind: "product", categorySlug: "pallet-drum-handling", productSlug: "pallet-trucks", label: "Pallet Trucks" },
	{ kind: "product", categorySlug: "goods-lift", productSlug: "hydraulic-lift", label: "Hydraulic Goods Lift" },
]

export function buildHeroSpotlights(products: Product[], categories: ProductCategory[]): HeroSpotlight[] {
	const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
	const productByKey = new Map(products.map((p) => [`${p.categorySlug}/${p.slug}`, p]))

	const out: HeroSpotlight[] = []

	for (const entry of HERO_SPOTLIGHT_ORDER) {
		if (entry.kind === "category") {
			const category = categoryBySlug.get(entry.categorySlug)
			if (!category) continue

			let image = category.heroImage
			if (entry.heroImageFromProduct) {
				const key = `${entry.heroImageFromProduct.categorySlug}/${entry.heroImageFromProduct.productSlug}`
				const productForHero = productByKey.get(key)
				if (productForHero?.heroImages[0]) image = productForHero.heroImages[0]
			}

			out.push({
				title: entry.label,
				href: `/products/${entry.categorySlug}`,
				image,
			})
			continue
		}

		const product = productByKey.get(`${entry.categorySlug}/${entry.productSlug}`)
		if (!product?.heroImages[0]) continue
		out.push({
			title: entry.label,
			href: `/products/${entry.categorySlug}/${entry.productSlug}`,
			image: product.heroImages[0],
		})
	}

	return out
}
