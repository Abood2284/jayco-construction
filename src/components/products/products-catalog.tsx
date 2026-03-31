"use client"

import { useMemo, useState } from "react"
import { ProductCard } from "@/components/products/product-card"
import type { Product, ProductCategory } from "@/lib/cms/types"

const ALL_CATEGORIES_SLUG = "__all__"

interface ProductsCatalogProps {
	categories: ProductCategory[]
	products: Product[]
}

const pillBase =
	"min-h-11 touch-manipulation rounded-md border-2 px-3 py-2 text-left text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"

const sidebarBtnBase =
	"relative group flex min-h-11 touch-manipulation items-center rounded-md border-2 px-4 py-3 text-left text-sm font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"

export function ProductsCatalog({ categories, products }: ProductsCatalogProps) {
	const [activeCategorySlug, setActiveCategorySlug] = useState<string>(ALL_CATEGORIES_SLUG)

	const countsBySlug = useMemo(() => {
		const map = new Map<string, number>()
		for (const p of products) map.set(p.categorySlug, (map.get(p.categorySlug) ?? 0) + 1)
		return map
	}, [products])

	const filteredProducts =
		activeCategorySlug === ALL_CATEGORIES_SLUG
			? products
			: products.filter((p) => p.categorySlug === activeCategorySlug)

	const activeHeading =
		activeCategorySlug === ALL_CATEGORIES_SLUG
			? "All products"
			: (categories.find((c) => c.slug === activeCategorySlug)?.name ?? "Products")

	const headingId = "products-catalog-heading"

	return (
		<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
			{/* Mobile filters */}
			<div className="lg:hidden">
				<p id="mobile-category-filter-label" className="mb-2 text-sm font-medium text-slate-600">
					Filter by category
				</p>
				<div
					role="group"
					aria-labelledby="mobile-category-filter-label"
					className="flex flex-wrap gap-2"
				>
					<button
						type="button"
						aria-pressed={activeCategorySlug === ALL_CATEGORIES_SLUG}
						onClick={() => setActiveCategorySlug(ALL_CATEGORIES_SLUG)}
						className={`${pillBase} ${
							activeCategorySlug === ALL_CATEGORIES_SLUG
								? "border-amber-500 bg-slate-900 text-white"
								: "border-slate-200 bg-white text-slate-800 active:bg-slate-50"
						}`}
					>
						All
						<span
							className={`ml-1.5 tabular-nums ${
								activeCategorySlug === ALL_CATEGORIES_SLUG ? "text-amber-300" : "text-slate-400"
							}`}
						>
							{products.length}
						</span>
					</button>
					{categories.map((category) => {
						const isActive = activeCategorySlug === category.slug
						const count = countsBySlug.get(category.slug) ?? 0

						return (
							<button
								key={category.slug}
								type="button"
								aria-pressed={isActive}
								onClick={() => setActiveCategorySlug(category.slug)}
								className={`${pillBase} ${
									isActive
										? "border-amber-500 bg-slate-900 text-white"
										: "border-slate-200 bg-white text-slate-800 active:bg-slate-50"
								}`}
							>
								{category.name}
								<span className={`ml-1.5 tabular-nums ${isActive ? "text-amber-300" : "text-slate-400"}`}>
									{count}
								</span>
							</button>
						)
					})}
				</div>
			</div>

			{/* Desktop sidebar */}
			<aside className="sticky top-[100px] z-20 hidden w-64 shrink-0 flex-col lg:flex" aria-label="Product categories">
				<h3 className="mb-4 border-b-2 border-slate-900 pb-3 text-xs font-bold uppercase tracking-widest text-slate-900">
					Categories
				</h3>
				<div className="flex flex-col gap-2" role="group" aria-label="Filter products by category">
					<button
						type="button"
						aria-pressed={activeCategorySlug === ALL_CATEGORIES_SLUG}
						onClick={() => setActiveCategorySlug(ALL_CATEGORIES_SLUG)}
						className={`${sidebarBtnBase} ${
							activeCategorySlug === ALL_CATEGORIES_SLUG
								? "border-amber-600 bg-slate-900 text-white shadow-sm"
								: "border-slate-200 bg-white text-slate-800 shadow-sm hover:border-amber-400 hover:bg-slate-50"
						}`}
					>
						{activeCategorySlug === ALL_CATEGORIES_SLUG && (
							<span className="absolute bottom-0 left-0 top-0 w-1 bg-amber-500" aria-hidden />
						)}
						<span className="relative z-10 pl-1">All products</span>
						<span
							className={`ml-auto text-xs font-bold tabular-nums ${
								activeCategorySlug === ALL_CATEGORIES_SLUG
									? "text-amber-400"
									: "text-slate-400 group-hover:text-amber-600"
							}`}
						>
							{products.length}
						</span>
					</button>
					{categories.map((category) => {
						const isActive = activeCategorySlug === category.slug
						const count = countsBySlug.get(category.slug) ?? 0

						return (
							<button
								key={category.slug}
								type="button"
								aria-pressed={isActive}
								onClick={() => setActiveCategorySlug(category.slug)}
								className={`${sidebarBtnBase} ${
									isActive
										? "border-amber-600 bg-slate-900 text-white shadow-sm"
										: "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-amber-400 hover:bg-slate-50"
								}`}
							>
								{isActive && <span className="absolute bottom-0 left-0 top-0 w-1 bg-amber-500" aria-hidden />}
								<span className="relative z-10 pl-1">{category.name}</span>
								<span
									className={`ml-auto text-xs font-bold tabular-nums ${
										isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-600"
									}`}
								>
									{count}
								</span>
							</button>
						)
					})}
				</div>
			</aside>

			{/* Results */}
			<div className="flex-1">
				<div className="mb-6 border-b border-slate-200 pb-4 lg:mb-8 lg:border-b-2 lg:border-slate-900">
					<h2
						id={headingId}
						className="animate-in fade-in slide-in-from-left-2 text-2xl font-bold tracking-tight text-slate-900 duration-300 lg:text-3xl"
					>
						{activeHeading}
					</h2>
				</div>

				<div role="region" aria-labelledby={headingId} aria-live="polite">
					{products.length === 0 ? (
						<div className="flex h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-center">
							<p className="text-sm font-medium text-slate-600">No products are available yet.</p>
						</div>
					) : filteredProducts.length > 0 ? (
						<div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
							{filteredProducts.map((product) => (
								<div
									key={`${product.categorySlug}-${product.slug}`}
									className="animate-in fade-in zoom-in-95 fill-mode-both duration-500"
								>
									<ProductCard product={product} />
								</div>
							))}
						</div>
					) : (
						<div className="flex h-64 flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-center">
							<p className="text-sm font-medium text-slate-600">No products in this category.</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
