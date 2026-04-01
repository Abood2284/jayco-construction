"use client"

import type { CategoryFilterOption } from "@/components/products/catalog-utils"
import { ALL_CATEGORIES_SLUG } from "@/components/products/catalog-utils"

interface ProductsFilterBarProps {
	options: CategoryFilterOption[]
	activeCategorySlug: string
	onSelectCategory: (slug: string) => void
	query?: string
}

function getPreviewCopy(option: CategoryFilterOption) {
	if (option.slug === ALL_CATEGORIES_SLUG) {
		return "View the full Jayco catalog in one place."
	}

	if (option.sampleProducts.length === 0) {
		return "No matching products in this family."
	}

	return option.sampleProducts.join(" • ")
}

export function ProductsFilterBar({
	options,
	activeCategorySlug,
	onSelectCategory,
	query,
}: ProductsFilterBarProps) {
	return (
		<section className="sticky top-20 z-20 rounded-[1.75rem] border border-slate-200 bg-white/95 p-4 shadow-[0_18px_50px_-32px_rgba(15,23,42,0.4)] backdrop-blur lg:static lg:p-5">
			<div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-amber-700">
						Catalog filters
					</p>
					<h2 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
						{query ? "Refine matching product families" : "Browse by product family"}
					</h2>
				</div>
				<p className="text-sm font-medium text-slate-500">
					Clear family filters. Keep the next click obvious.
				</p>
			</div>

			<div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 scrollbar-none md:grid md:grid-cols-2 md:overflow-visible xl:grid-cols-4">
				{options.map((option) => {
					const isActive = option.slug === activeCategorySlug
					const isDisabled = option.count === 0 && option.slug !== ALL_CATEGORIES_SLUG

					return (
						<button
							key={option.slug}
							type="button"
							aria-pressed={isActive}
							disabled={isDisabled}
							onClick={() => onSelectCategory(option.slug)}
							className={`min-w-[16rem] snap-start rounded-[1.35rem] border px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 md:min-w-0 ${
								isActive
									? "border-slate-900 bg-slate-950 text-white shadow-[0_20px_40px_-28px_rgba(15,23,42,0.85)]"
									: isDisabled
										? "border-slate-200 bg-slate-100 text-slate-400"
										: "border-slate-200 bg-slate-50 text-slate-900 hover:border-amber-300 hover:bg-amber-50"
							}`}
						>
							<div className="flex items-start justify-between gap-3">
								<span className="pr-2 text-sm font-semibold tracking-tight">{option.name}</span>
								<span
									className={`rounded-full px-2 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${
										isActive
											? "bg-amber-400/15 text-amber-300"
											: isDisabled
												? "bg-slate-200 text-slate-400"
												: "bg-white text-slate-500"
									}`}
								>
									{option.count}
								</span>
							</div>
							<p
								className={`mt-3 text-sm leading-relaxed ${
									isActive ? "text-slate-300" : isDisabled ? "text-slate-400" : "text-slate-600"
								}`}
							>
								{getPreviewCopy(option)}
							</p>
						</button>
					)
				})}
			</div>
		</section>
	)
}
