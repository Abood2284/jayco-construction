"use client"

import Link from "next/link"
import { EmptyResultsState } from "@/components/products/empty-results-state"
import { ProductCatalogCard } from "@/components/products/product-catalog-card"
import { ALL_CATEGORIES_SLUG } from "@/components/products/catalog-utils"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface ProductsGridProps {
	products: Product[]
	categories: ProductCategory[]
	activeCategorySlug: string
	query?: string
	onResetCategory: () => void
}

function buildResultsCopy({
	totalCount,
	activeCategoryName,
	query,
}: {
	totalCount: number
	activeCategoryName: string
	query?: string
}) {
	if (query) {
		return `${totalCount} matching product${totalCount === 1 ? "" : "s"} across ${activeCategoryName.toLowerCase()}.`
	}

	if (activeCategoryName === "All products") {
		return `${totalCount} catalog entries across Jayco's current lifting and handling range.`
	}

	return `${totalCount} product${totalCount === 1 ? "" : "s"} in this family.`
}

export function ProductsGrid({
	products,
	categories,
	activeCategorySlug,
	query,
	onResetCategory,
}: ProductsGridProps) {
	const activeCategory =
		activeCategorySlug === ALL_CATEGORIES_SLUG
			? null
			: categories.find((category) => category.slug === activeCategorySlug) ?? null

	const activeCategoryName = activeCategory?.name ?? "All products"

	if (products.length === 0) {
		return (
			<EmptyResultsState
				title={
					activeCategory
						? `No products found in ${activeCategory.name}`
						: query
							? `No products matched "${query}"`
							: "No products are available yet"
				}
				description={
					activeCategory
						? "Reset the family filter or speak with Jayco if you need help narrowing the right equipment."
						: query
							? "Try a broader keyword or contact Jayco if you know the application but not the product name."
							: "The catalog is temporarily empty. Contact Jayco for immediate product guidance."
				}
				onReset={activeCategory ? onResetCategory : undefined}
				showReset={Boolean(activeCategory)}
			/>
		)
	}

	return (
		<section className="space-y-6" aria-labelledby="products-results-heading">
			<div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-xs font-semibold tracking-wide text-red-700">Results</p>
					<h2
						id="products-results-heading"
						className="mt-1 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl"
					>
						{query ? `“${query}”` : activeCategoryName}
					</h2>
					<p className="mt-1 text-sm text-slate-600">
						{buildResultsCopy({
							totalCount: products.length,
							activeCategoryName,
							query,
						})}
					</p>
				</div>

				<div className="flex flex-wrap gap-2">
					{query ? (
						<Link
							href="/products"
							className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
						>
							Clear search
						</Link>
					) : null}
					{activeCategorySlug !== ALL_CATEGORIES_SLUG ? (
						<button
							type="button"
							onClick={onResetCategory}
							className="inline-flex min-h-10 items-center justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
						>
							View all products
						</button>
					) : null}
				</div>
			</div>

			<div role="region" aria-labelledby="products-results-heading" aria-live="polite">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
					{products.map((product) => (
						<ProductCatalogCard key={`${product.categorySlug}-${product.slug}`} product={product} />
					))}
				</div>
			</div>
		</section>
	)
}
