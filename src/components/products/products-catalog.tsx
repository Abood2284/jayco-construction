"use client"

import { useMemo, useState } from "react"
import {
	ALL_CATEGORIES_SLUG,
	buildCategoryFilterOptions,
	type CategoryFilterOption,
} from "@/components/products/catalog-utils"
import { ProductsFilterBar } from "@/components/products/products-filter-bar"
import { ProductsGrid } from "@/components/products/products-grid"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface ProductsCatalogProps {
	categories: ProductCategory[]
	products: Product[]
	query?: string
}

export function ProductsCatalog({ categories, products, query }: ProductsCatalogProps) {
	const [activeCategorySlug, setActiveCategorySlug] = useState<string>(ALL_CATEGORIES_SLUG)

	const categoryOptions = useMemo<CategoryFilterOption[]>(() => {
		const options = buildCategoryFilterOptions(categories, products)

		return [
			{
				slug: ALL_CATEGORIES_SLUG,
				name: "All products",
				count: products.length,
				sampleProducts: products.slice(0, 2).map((product) => product.name),
			},
			...options,
		]
	}, [categories, products])

	const filteredProducts =
		activeCategorySlug === ALL_CATEGORIES_SLUG
			? products
			: products.filter((product) => product.categorySlug === activeCategorySlug)

	return (
		<div className="space-y-6 lg:space-y-8">
			<ProductsFilterBar
				options={categoryOptions}
				activeCategorySlug={activeCategorySlug}
				onSelectCategory={setActiveCategorySlug}
				query={query}
			/>
			<ProductsGrid
				products={filteredProducts}
				categories={categories}
				activeCategorySlug={activeCategorySlug}
				query={query}
				onResetCategory={() => setActiveCategorySlug(ALL_CATEGORIES_SLUG)}
			/>
		</div>
	)
}
