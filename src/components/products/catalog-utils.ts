import type { Product, ProductCategory, ProductSpec } from "@/lib/cms/types"

export const ALL_CATEGORIES_SLUG = "__all__"

export type ProductQuickMeta = {
	label: string
	value: string
}

export type CategoryFilterOption = {
	slug: string
	name: string
	count: number
	sampleProducts: string[]
}

function trimText(value: string, maxLength: number) {
	const normalized = value.replace(/\s+/g, " ").trim()
	if (normalized.length <= maxLength) {
		return normalized
	}

	const sliced = normalized.slice(0, maxLength)
	const lastSpace = sliced.lastIndexOf(" ")
	return `${(lastSpace > 32 ? sliced.slice(0, lastSpace) : sliced).trimEnd()}...`
}

function pickQuickSpecs(product: Product, limit: number) {
	const items: ProductSpec[] = []

	for (const spec of product.specs) {
		if (items.length >= limit) break
		items.push(spec)
	}

	if (items.length < limit) {
		for (const spec of product.additionalInfo ?? []) {
			if (items.length >= limit) break
			items.push(spec)
		}
	}

	return items
}

export function getProductDescriptor(product: Product) {
	return trimText(product.excerpt ?? product.description, 150)
}

export function getProductQuickMeta(product: Product, limit = 2): ProductQuickMeta[] {
	const quickSpecs = pickQuickSpecs(product, limit)
	if (quickSpecs.length > 0) {
		return quickSpecs.map((item) => ({
			label: item.label,
			value: trimText(item.value, 96),
		}))
	}

	if (product.features.length > 0) {
		return product.features.slice(0, limit).map((feature, index) => ({
			label: index === 0 ? "Key detail" : "Additional detail",
			value: trimText(feature, 96),
		}))
	}

	return []
}

export function buildCategoryFilterOptions(categories: ProductCategory[], products: Product[]): CategoryFilterOption[] {
	return categories.map((category) => {
		const categoryProducts = products.filter((product) => product.categorySlug === category.slug)

		return {
			slug: category.slug,
			name: category.name,
			count: categoryProducts.length,
			sampleProducts: categoryProducts.slice(0, 2).map((product) => product.name),
		}
	})
}
