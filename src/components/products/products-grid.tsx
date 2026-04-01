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
			<div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 px-5 py-5 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.35)] sm:px-6">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div>
						<p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-700">
							Catalog results
						</p>
						<h2
							id="products-results-heading"
							className="mt-2 text-[clamp(1.8rem,3vw,2.6rem)] font-semibold tracking-tight text-slate-950"
						>
							{query ? `Results for "${query}"` : activeCategoryName}
						</h2>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
							{buildResultsCopy({
								totalCount: products.length,
								activeCategoryName,
								query,
							})}
						</p>
					</div>

					<div className="flex flex-wrap gap-3">
						{query && (
							<Link
								href="/products"
								className="inline-flex min-h-11 items-center justify-center rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-amber-700 hover:bg-amber-50 hover:text-amber-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
							>
								Clear search
							</Link>
						)}
						{activeCategorySlug !== ALL_CATEGORIES_SLUG && (
							<button
								type="button"
								onClick={onResetCategory}
								className="inline-flex min-h-11 items-center justify-center rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
							>
								View all products
							</button>
						)}
					</div>
				</div>
			</div>

			<div role="region" aria-labelledby="products-results-heading" aria-live="polite">
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
					{products.map((product) => (
						<ProductCatalogCard key={`${product.categorySlug}-${product.slug}`} product={product} />
					))}
				</div>
			</div>
		</section>
	)
}
