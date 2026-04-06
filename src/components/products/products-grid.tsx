"use client"

import Image from "next/image"
import Link from "next/link"
import { EmptyResultsState } from "@/components/products/empty-results-state"
import { ALL_CATEGORIES_SLUG } from "@/components/products/catalog-utils"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface ProductsGridProps {
	products: Product[]
	categories: ProductCategory[]
	activeCategorySlug: string
	query?: string
	onResetCategory: () => void
}

function CatalogSquareProductCard({ product }: { product: Product }) {
	const image = product.heroImages[0]

	return (
		<Link
			href={`/products/${product.categorySlug}/${product.slug}`}
			className="group flex min-h-0 flex-col gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
		>
			<div className="overflow-hidden rounded-lg border border-slate-200/90 bg-white shadow-sm transition-[box-shadow,border-color,transform] duration-200 motion-reduce:transition-none group-hover:border-slate-300 group-hover:shadow-md group-hover:ring-1 group-hover:ring-slate-200/80 motion-safe:sm:group-hover:-translate-y-0.5 motion-reduce:sm:group-hover:translate-y-0">
				<div className="relative aspect-square w-full overflow-hidden bg-slate-100">
					{image ? (
						<Image
							src={image.src}
							alt=""
							fill
							sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 18vw"
							className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-[1.03] motion-reduce:group-hover:scale-100"
						/>
					) : (
						<div className="absolute inset-0 bg-slate-200/90" aria-hidden />
					)}
					<div
						className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-200 motion-reduce:transition-none group-hover:opacity-100 motion-reduce:group-hover:opacity-0"
						aria-hidden
					/>
				</div>
			</div>
			<p className="m-0 line-clamp-2 text-left text-xs font-semibold leading-tight tracking-tight text-slate-700 underline decoration-transparent decoration-2 underline-offset-4 transition-colors motion-reduce:transition-none group-hover:text-slate-900 group-hover:decoration-slate-300 sm:text-sm">
				{product.name}
			</p>
		</Link>
	)
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

	const srHeading =
		query != null && query.length > 0
			? `Search “${query}”, ${products.length} product${products.length === 1 ? "" : "s"}`
			: activeCategory
				? `${activeCategory.name}, ${products.length} product${products.length === 1 ? "" : "s"}`
				: `${products.length} product${products.length === 1 ? "" : "s"}`

	const showToolbar = Boolean(query) || activeCategorySlug !== ALL_CATEGORIES_SLUG

	return (
		<section className="space-y-5 sm:space-y-6">
			<h2 id="products-catalog-heading" className="sr-only">
				{srHeading}
			</h2>

			{showToolbar ? (
				<div className="flex flex-wrap items-center justify-end gap-2 border-b border-slate-200 pb-4 sm:pb-5">
					{query ? (
						<Link
							href="/products"
							className="inline-flex min-h-10 items-center justify-center rounded-full border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 transition hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
						>
							Clear search
						</Link>
					) : null}
					{activeCategorySlug !== ALL_CATEGORIES_SLUG ? (
						<button
							type="button"
							onClick={onResetCategory}
							className="inline-flex min-h-10 items-center justify-center rounded-full bg-slate-950 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2"
						>
							Show all categories
						</button>
					) : null}
				</div>
			) : null}

			<div
				role="region"
				aria-labelledby="products-catalog-heading"
				aria-live="polite"
				aria-atomic="true"
			>
				<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5 xl:gap-6">
					{products.map((product) => (
						<CatalogSquareProductCard key={`${product.categorySlug}-${product.slug}`} product={product} />
					))}
				</div>
			</div>
		</section>
	)
}
