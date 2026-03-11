"use client"

import { useState } from "react"
import { ProductCard } from "@/components/products/product-card"
import type { Product, ProductCategory } from "@/lib/cms/types"

interface ProductsCatalogProps {
	categories: ProductCategory[]
	products: Product[]
}

export function ProductsCatalog({ categories, products }: ProductsCatalogProps) {
	// Defaut to the first available category
	const [activeCategorySlug, setActiveCategorySlug] = useState<string>(categories[0]?.slug || "")

	// Filter products matching the currently selected category tab
	const filteredProducts = products.filter((p) => p.categorySlug === activeCategorySlug)

	return (
		<div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
			{/* Mobile Category Pills */}
			<div className="flex flex-wrap gap-2 lg:hidden">
				{categories.map((category) => {
					const isActive = activeCategorySlug === category.slug
					const count = products.filter(p => p.categorySlug === category.slug).length

					return (
						<button
							key={category.slug}
							onClick={() => setActiveCategorySlug(category.slug)}
							className={`border-2 px-3 py-1.5 text-xs font-black uppercase tracking-wide transition-all ${
								isActive
									? "border-amber-500 bg-slate-900 text-white"
									: "border-slate-300 bg-white text-slate-700 active:bg-slate-100"
							}`}
						>
							{category.name}
							<span className={`ml-1.5 ${isActive ? "text-amber-400" : "text-slate-400"}`}>
								{count}
							</span>
						</button>
					)
				})}
			</div>

			{/* Desktop Sidebar Navigation */}
			<aside className="sticky top-[100px] z-20 hidden w-64 shrink-0 flex-col lg:flex">
				<h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-slate-900 border-b-2 border-slate-900 pb-3">
					Equipment Categories
				</h3>
				<div className="flex flex-col gap-2">
					{categories.map((category) => {
						const isActive = activeCategorySlug === category.slug

						return (
							<button
								key={category.slug}
								onClick={() => setActiveCategorySlug(category.slug)}
								className={`group relative flex items-center border-2 px-4 py-3.5 text-left text-sm font-black uppercase tracking-tight transition-all ${
									isActive
										? "border-amber-500 bg-slate-900 text-white shadow-[4px_4px_0_0_rgba(245,158,11,1)]"
										: "border-slate-900 bg-white text-slate-700 shadow-[4px_4px_0_0_rgba(15,23,42,1)] hover:bg-slate-50 hover:border-amber-500"
								}`}
							>
								{/* Active Left Bar */}
								{isActive && (
									<span className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
								)}
								<span className="relative z-10 pl-1">{category.name}</span>
								
								{/* Count Tag */}
								<span className={`ml-auto text-xs font-black ${
									isActive ? "text-amber-400" : "text-slate-400 group-hover:text-amber-600"
								}`}>
									{products.filter(p => p.categorySlug === category.slug).length}
								</span>
							</button>
						)
					})}
				</div>
			</aside>

			{/* Filtered Grid Section */}
			<div className="flex-1">
				{/* Active Category Header */}
				<div className="mb-6 border-b-2 border-slate-900 pb-4 lg:mb-8">
					<h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 animate-in fade-in slide-in-from-left-2 duration-300 lg:text-3xl">
						{categories.find((c) => c.slug === activeCategorySlug)?.name}
					</h2>
				</div>

				{/* Products Grid */}
				{filteredProducts.length > 0 ? (
					<div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-2 xl:grid-cols-3">
						{filteredProducts.map((product) => (
							<div key={product.slug} className="animate-in fade-in zoom-in-95 duration-500 fill-mode-both">
								<ProductCard product={product} />
							</div>
						))}
					</div>
				) : (
					<div className="flex h-64 flex-col items-center justify-center border-2 border-slate-900 bg-slate-50 text-center shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
						<p className="text-sm font-black uppercase tracking-widest text-slate-600">No products available in this category.</p>
					</div>
				)}
			</div>
		</div>
	)
}
